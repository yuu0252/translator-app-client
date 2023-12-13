import axios from 'axios';
import './App.css';

function App() {
  // const image = axios.post('https://vision.googleapis.com/v1/images:annotate')

  const onChangeImage = (e: any) => {
    const file = e.target.value;
    const reader = new FileReader();
    reader.addEventListener('load', (e) => {
      console.log(e);
    });
  };

  return (
    <>
      <input type="file" onChange={onChangeImage} />
    </>
  );
}

export default App;
