import { useDispatch } from 'react-redux';
import { languageCode } from '../constants';

export const Header = () => {
  const dispatch = useDispatch();
  return (
    <div id="header">
      <div className="select-box">
        <select onChange={(e) => console.log(e.target.value)}>
          <option key="default">{'言語を選択してください'}</option>
          {Object.values(languageCode).map((value) => (
            <option key={value.name}>{value.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
