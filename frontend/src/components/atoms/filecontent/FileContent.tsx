import {Children, FC, ReactElement, ReactNode, useCallback} from "react";
import {createElement, PrismAsync as SyntaxHighlighter} from "react-syntax-highlighter";
import atomDarkStyle from "react-syntax-highlighter/dist/cjs/styles/prism/atom-dark";
import {FileComment, FileCommentProps} from "./FileComment";

interface RendererArgs {
  rows: any[];
  stylesheet: any;
  useInlineStyles: boolean;
}

const style = {
  ...atomDarkStyle,
  'pre[class*="language-"]': {
    ...atomDarkStyle['pre[class*="language-"]'],
    background: "#202020",
    fontSize: 12,
    fontFamily: '"Fira Code", monospace',
    borderRadius: 12
  },
  'code[class*="language-"]': {
    ...atomDarkStyle['code[class*="language-"]'],
    fontFamily: '"Fira Code", monospace'
  }
};

type Renderer = (arg: RendererArgs) => void;
type FileCommentElement = ReactElement<FileCommentProps, typeof FileComment>;

function getCommentChildren(children: ReactNode | ReactNode[]): FileCommentElement[] {
  return (
    Children.toArray(children).filter((child) => (child as ReactElement).type === FileComment) as FileCommentElement[]
  ).sort((a, b) => a.props.startLine - b.props.startLine);
}

function createCommentElement(
  comment: FileCommentElement,
  nodes: any[],
  stylesheet: any,
  useInlineStyles: boolean
): ReactElement {
  return createElement({
    node: {
      type: "element",
      tagName: FileComment,
      properties: {
        className: [],
        elements: nodes.map((node, i) =>
          createElement({
            node,
            stylesheet,
            useInlineStyles,
            key: `code-comment-${comment.props.comment.id}-segment-${i}`
          })
        ),
        ...comment.props
      },
      children: []
    },
    stylesheet,
    useInlineStyles,
    key: `code-comment-${comment.props.comment.id}`
  });
}

interface FileContentProps {
  content: string;
  language: string;
}

export const FileContent: FC<FileContentProps> = ({content, language, children}) => {
  const renderer = useCallback<Renderer>(
    ({rows, stylesheet, useInlineStyles}) => {
      const comments = getCommentChildren(children);
      let childNodes: any[] | null = null;
      let currentComment: FileCommentElement | null = null;
      const nodes: ReactElement[] = [];

      for (let i = 0; i < rows.length; i++) {
        if (currentComment !== null && childNodes !== null) {
          const stopLine = currentComment.props.startLine + currentComment.props.numLines - 1;
          if (i < stopLine) {
            childNodes.push(rows[i]);
            continue;
          }
          nodes.push(createCommentElement(currentComment, childNodes, stylesheet, useInlineStyles));
          childNodes = null;
          currentComment = null;
        }

        const newComment = comments.find((comment) => comment.props.startLine === i + 1);
        if (newComment) {
          currentComment = newComment;
          childNodes = [rows[i]];
        } else {
          nodes.push(
            createElement({
              node: rows[i],
              stylesheet,
              useInlineStyles,
              key: `code-segment${i}`
            })
          );
        }
      }

      return nodes;
    },
    [children]
  );

  return (
    <SyntaxHighlighter showLineNumbers style={style} language={language} renderer={renderer}>
      {content}
    </SyntaxHighlighter>
  );
};
