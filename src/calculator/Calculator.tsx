import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectLanguage } from '../reducer/languageSlice';
import { languageCodeList } from '../constants';
import styled from 'styled-components';

export const Calculator = () => {
  const [isCoupon, setIsCoupon] = useState(false);
  const [isHandlingCharge, setIsHandlingCharge] = useState(true);
  const [price, setPrice] = useState(0);
  const [foreignPrice, setForeignPrice] = useState<number>();
  const [inputPrice, setInputPrice] = useState<number | null>(null);
  const language = useSelector(selectLanguage);
  const [updatedTime, setUpdatedTime] = useState('');

  const [rate, setRate] = useState();
  const rateCode = languageCodeList.find((e) => e.code === language.language)
    ?.rate.code;
  const rateSign = languageCodeList.find((e) => e.code === language.language)
    ?.rate.sign;

  const convertToDate = (time: string) => {
    const date = new Date(time);
    console.log(date);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();

    const result = '( at : ' + month + '/' + day + ' ' + hour + ':00 )';

    return result;
  };

  const rateFetch = () => {
    axios
      .get(
        `${import.meta.env.VITE_EXCHANGE_URL}${
          import.meta.env.VITE_EXCHANGE_API_KEY
        }/latest/JPY`
      )
      .then((res) => {
        const time = convertToDate(res.data.time_last_update_utc);
        setUpdatedTime(time);
        const rateCode = languageCodeList.find(
          (e) => e.code === language.language
        )?.rate.code;
        console.log(rateCode);
        rateCode && setRate(res.data.conversion_rates[rateCode]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const calculateForeign = (num: number) => {
    console.log(rate);
    const result = rate ? Math.ceil(num * rate * 100) / 100 : 0;
    return result;
  };

  const onChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPrice(Number(e.target.value));
    let num = Number(e.target.value);
    num = num / 1.1;

    let result = num;

    setPrice(result);

    console.log(rate);

    const resultForeign = calculateForeign(result);
    setForeignPrice(resultForeign);
  };

  useEffect(() => {
    console.log(language.language);
    const resultForeign = calculateForeign(price);
    setForeignPrice(resultForeign);
  }, [rate]);

  useEffect(() => {
    rateFetch();
  }, [language.language]);

  return (
    <>
      <Header />
      <StyledCalculator id="calculator" className="container">
        <div className="content-area">
          <div>
            <span>{'￥' + Math.ceil(price)}</span>

            {language.language !== 'none' && (
              <>
                {rateSign && <span>{rateSign + foreignPrice}</span>}
                <span>{rateCode}</span>
                <span className="time">{updatedTime}</span>
              </>
            )}
          </div>
        </div>
        <div className="input-area">
          <div className="user-input">
            <input
              type="number"
              onChange={onChangePrice}
              value={inputPrice ?? ''}
              placeholder="ここに金額を入力"
            />
            <button
              className="reset-btn"
              onClick={() => {
                setInputPrice(null);
                setPrice(0);
              }}
            >
              リセット
            </button>
          </div>
        </div>
      </StyledCalculator>
    </>
  );
};

const StyledCalculator = styled.div`
  & .content-area {
    height: 60%;
  }

  & .input-area {
    background-color: #fff;
    padding: 15px;
    border-radius: 15px;
  }

  & .user-input {
    display: flex;
    column-gap: 15px;
  }

  & button {
    width: 90px;
    height: auto;
    border-radius: 5px;
    border: 2px solid #333;
    font-weight: bold;
    white-space: nowrap;

    &.active {
      color: #fff;
      background-color: #3c87ff;
    }
  }

  & input {
    border: #333 2px solid;
    padding: 5px;
    border-radius: 5px;
    text-align: center;
  }

  & .time {
    font-weight: normal;
    font-size: 0.75em;
  }
`;
