import string
import re

import numpy as np
import nltk
import fasttext


class WordProcessor:
    def __init__(self, word_embedding_file):
        # load word embedding
        self._word_embedding = fasttext.load_model(word_embedding_file)
        self._word_embedding_cache = {}
        self._vec2word_cache = {}

        self._tokenizer_words = nltk.TweetTokenizer()
        self._punctuation = string.punctuation.replace('!', '').replace('?', '')

        # set padding
        self._padding = '<pad>'

    def comment_pre_processing(self, comment):
        """
        Pre-process comment

        :param comment:
        :return:
        """
        comment = re.sub('(//)|(/\\*)|(\\*/)', '', comment).lower()
        tokens_sentences = [self._tokenizer_words.tokenize(t) for t in nltk.sent_tokenize(comment)]

        processed_tokens_sentences = []
        for sentence in tokens_sentences:
            processed_tokens = []
            for token in sentence:
                if token == 'non-nls' or token == self._padding:
                    processed_tokens.append(token)
                    continue
                elif token == ',':
                    processed_tokens.append('.')
                elif ' ' in token or '.' in token or '#' in token or '_' in token or '/' in token:
                    continue
                elif '>' in token or '<' in token or '@' in token:
                    continue
                elif any(char.isdigit() for char in token):
                    continue
                else:
                    processed_tokens.append(token)

            if len(processed_tokens) > 0:
                if processed_tokens[-1] != '.':
                    processed_tokens.append('.')
            processed_tokens_sentences.append(processed_tokens)

        tokens_sentences = processed_tokens_sentences
        tokens = [word for t in tokens_sentences for word in t]
        stripped = [word for word in tokens if
                    word and (word not in self._punctuation and ':' not in word and '=' not in word
                              and ')' not in word and '(' not in word)]

        return stripped

    def prepare_comments(self, comment, size_of_input):
        """
        Prepare comments for machine learning model

        :return:
        """
        pre_stripped = self.comment_pre_processing(comment)

        if len(pre_stripped) > size_of_input:
            new_sentence = pre_stripped[:size_of_input]
        else:
            num_padding = size_of_input - len(pre_stripped)
            new_sentence = pre_stripped + [self._padding] * num_padding

        x_test = []
        for word in new_sentence:
            if word not in self._word_embedding_cache:
                word_embed = self._word_embedding[word]
                self._word_embedding_cache[word] = word_embed
                self._vec2word_cache[' '.join([str(v) for v in word_embed])] = word
                x_test.append(word_embed)
            else:
                x_test.append(self._word_embedding_cache[word])

        return np.array([x_test])

    def get_deconvolution_words(self, input_x):
        """

        :return:
        """
        word_text = []
        # get original sentence
        for word_ind in input_x[0]:
            word = self._vec2word_cache[' '.join([str(vi) for vi in word_ind])]
            word_text.append(word)
        return word_text
