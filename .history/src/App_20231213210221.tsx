import axios from 'axios';
import './App.css';

function App() {
  // const image = axios.post('https://vision.googleapis.com/v1/images:annotate')

  const onChangeImage = () => {
    const file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (e) => {
      console.log(e);
    });
  };

  return (
    <>
      <input type="file" onChange={onChangeImage} />
      <img src="" />
    </>
  );
}

export default App;
