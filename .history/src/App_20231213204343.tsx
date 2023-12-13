import axios from 'axios';
import './App.css';

function App() {
  // const image = axios.post('https://vision.googleapis.com/v1/images:annotate')

  const onChangeImage = (e: any) => {
    const file = e.target.value;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.currentTarget.result;
      console.log(base64);
    };
    console.log(reader);
  };

  return (
    <>
      <input type="file" onChange={onChangeImage} />
    </>
  );
}

export default App;
