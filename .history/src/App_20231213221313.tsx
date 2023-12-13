import axios from 'axios';
import Compressor from 'compressorjs';
import './App.css';

function App() {
  // const image = axios.post('https://vision.googleapis.com/v1/images:annotate')

  const onChangeImage = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    new Compressor(file, {
      quality: 0.6,

      // The compression process is asynchronous,
      // which means you have to access the `result` in the `success` hook function.
      success(result) {
        const blob = result;
        const text = new Response(blob).text();
      },
      error(err) {
        console.log(err.message);
      },
    });
  };

  return (
    <>
      <input type="file" id="file" onChange={onChangeImage} />
      <img src="" />
    </>
  );
}

export default App;
