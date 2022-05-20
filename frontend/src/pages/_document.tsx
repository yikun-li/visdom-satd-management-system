import Document, {Head, Html, Main, NextScript} from "next/document";

class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <div id="modals" />
          <div id="jobs" />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
