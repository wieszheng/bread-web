import React, {useEffect, useState} from "react";
import CodeMirror from '@uiw/react-codemirror';
import {material} from '@uiw/codemirror-theme-material';
import {json} from "@codemirror/lang-json";
import {yaml} from "@codemirror/lang-yaml";


export type CodeEditorProps = {
  value?: string;
  height?: string;
  editable: boolean;
  onChange?: any;
  type: number | string;
}
const CodeEditor: React.FC<CodeEditorProps> = ({value, height, editable, type, onChange}) => {
  const [language, setLanguage] = useState<any>([json()]);
  const [placeholder, setPlaceholder] = useState<string>('请输入JSON格式数据');

  useEffect(() => {
    if (type === '1') {
      setLanguage([json()])
      setPlaceholder('请输入JSON格式数据')
    } else if (type === '2') {
      setLanguage([yaml()])
      setPlaceholder('请输入YAML格式数据')
    } else {
      setLanguage([json()])
      setPlaceholder('请输入文本格式数据')
    }
  }, [type]);
  return (
    <CodeMirror
      value={value}
      height={height || "200px"}
      theme={material}
      extensions={language}
      placeholder={placeholder}
      editable={editable}
      onChange={onChange}/>
  )
};

export default CodeEditor;
