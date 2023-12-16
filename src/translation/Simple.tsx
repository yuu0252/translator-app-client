import { useState } from "react";
import { FaMicrophone } from "react-icons/fa6";

export const Simple = () => {
  const languageList = { English: "英語", 簡体字: "台湾・香港" };
  const placeholders = [
    "相手に先に喋ってもらうか(自動検出)、",
    "言語を選んでください(右上)",
    "Speak your language!",
    "说你的语言",
    "說你的語言",
    "พูดภาษาของคุณ",
    "nói ngôn ngữ của bạn",
    "magsalita ng iyong wika",
  ];
  const placeholder = placeholders.join(`\n`);
  const [outputText, setOutputText] = useState(placeholder);
  const [isRecording, setIsRecording] = useState(false);

  const audioContext = new window.AudioContext();
  if (navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const input = audioContext.createMediaStreamSource(stream);
      audioContext.resume();
      const recoder = new Recorder(input);
    });
  }

  return (
    <section id="simple">
      <div className="select-box">
        <select>
          <option key="default">言語を選択</option>
          {Object.entries(languageList).map(([key, value]) => (
            <option key={key}>{`${key}(${value})`}</option>
          ))}
        </select>
      </div>
      <div className="textarea">
        <p className={outputText === placeholder ? "placeholder" : ""}>
          <span>{outputText}</span>
        </p>
      </div>
      <button>
        <div>
          <FaMicrophone />
        </div>
      </button>
    </section>
  );
};
