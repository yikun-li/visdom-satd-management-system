FROM ubuntu:20.04
RUN apt-get update && apt-get -y install libpq-dev gcc

FROM tensorflow/tensorflow:latest
#WORKDIR /app

#COPY --from=builder /root/.local /root/.local
RUN mkdir /app
COPY . .
RUN sed -i 's/tensorflow/#tensorflow/g' requirements.txt
RUN pip install --user -r requirements.txt
RUN python -m nltk.downloader punkt

ENV PATH=/root/.local:$PATH
ENV FLASK_APP server

EXPOSE 5000

CMD python server.py
