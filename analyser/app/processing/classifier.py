import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model, Model
from tensorflow.keras.backend import softmax

from app.processing.wordprocesser import WordProcessor


class Classifier:
    """
    Self-admitted technical debt detector
    """

    def __init__(self, weight_file, word_processor: WordProcessor):
        """
        Initialization

        """
        print('Loading model {}...'.format(weight_file))
        # self._session = tf.compat.v1.Session()
        # self._graph = tf.compat.v1.get_default_graph()
        self._word_processor = word_processor
        self._model = load_model(weight_file)

        # get input sequence length
        self._size_of_input = self._model.layers[0].get_output_at(0).get_shape()[1]

        # get number of filters
        self._num_filters = self._model.layers[2].get_output_at(0).get_shape()[-1]

        # load model for keyword extraction
        ixs = []
        for i in range(len(self._model.layers)):
            layer = self._model.layers[i]
            # check for convolutional layer
            if 'input' in layer.name or 'reshape' in layer.name or 'embedding' in layer.name or 'dense' in layer.name \
                    or 'dropout' in layer.name:
                continue
            ixs.append(i)

        # save fully connected layer weights
        self._dense_weights = self._model.layers[-1].get_weights()[0]

        # redefine model to output right after the first hidden layer
        outputs = [self._model.layers[i].output for i in ixs]
        self._model_deconvolution = Model(inputs=self._model.inputs, outputs=outputs)

        label_num = self._model.layers[-1].get_output_at(0).get_shape()[-1]
        self._labels = ['DEBT', 'NOT_DEBT'] if label_num <= 2 \
            else ['NOT_DEBT', 'CODE_DESIGN', 'DOCUMENTATION', 'TEST', 'REQUIREMENT']

    def classify_prob_comment(self, comment):
        """
        Classify a single comment

        :param comment:
        """
        input_x = self._word_processor.prepare_comments(comment, self._size_of_input)

        y_pred = self._model.predict(input_x, verbose=1)
        y_pred_bool = np.argmax(y_pred, axis=1)

        dict_keywords = {}
        if self._labels[y_pred_bool[0]] != 'NOT_DEBT':
            dict_keywords = self.deconvolution(input_x, y_pred_bool[0])

        return y_pred[0, 0], self._labels[y_pred_bool[0]], dict_keywords

    def deconvolution(self, input_x, pred):
        """
        Run deconvolution to extract keywords

        :return:
        """
        word_text = self._word_processor.get_deconvolution_words(input_x)

        dict_keywords = {}
        list_keywords = []
        features = self._model_deconvolution.predict(input_x)

        # iterating all features
        list_tuple_prob = []
        for i, f in enumerate(features[-1][0]):
            w = f * self._dense_weights[i]
            prob = softmax(w)

            if prob[pred] > float(1.0 / len(self._labels)):
                list_tuple_prob.append((i, prob[pred], w[pred]))

        for (ind, prob, w) in list_tuple_prob:
            # localize the convolutional layer
            conv_num = int(ind / self._num_filters)
            # localize the index in the convolutional layer
            conv_ind = ind % self._num_filters

            # localize keywords index
            keywords_index = np.where(features[conv_num][0, :, 0, conv_ind] == features[-1][0, ind])[0][0]
            # calculate length of keywords
            keywords_length = self._size_of_input - features[conv_num].shape[1] + 1
            # keywords = word_text[keywords_index:keywords_index + keywords_length]
            # keywords = tuple([w for w in keywords if w != self._padding])
            keywords = [i for i in range(keywords_index, keywords_index + keywords_length)]

            for keyword in keywords:
                if keyword in dict_keywords.keys():
                    dict_keywords[keyword].append(w)
                else:
                    dict_keywords[keyword] = [w]

        for key in dict_keywords.keys():
            list_keywords.append((key, np.sum(dict_keywords[key])))
        list_keywords = sorted(list_keywords, key=lambda p: p[1], reverse=True)

        dict_final_keywords = {}
        for key in list_keywords:
            if key[1] > 0.5:
                dict_final_keywords[word_text[key[0]]] = key[1]

        return dict_final_keywords
