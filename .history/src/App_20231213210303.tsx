import axios from 'axios';
import './App.css';

function App() {
  // const image = axios.post('https://vision.googleapis.com/v1/images:annotate')

  const onChangeImage = () => {
    const file = document.querySelector('input[type=file]').files[0];
    const preview = document.querySelector('img');
    const reader = new FileReader();
    reader.addEventListener('load', (e) => {
      preview.src = reader.result;
    });

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <input type="file" onChange={onChangeImage} />
      <img src="" />
    </>
  );
}

export default App;
