import { useState } from 'react';
import { Header } from '../components/Header';

export const Calculator = () => {
  const [isCoupon, setIsCoupon] = useState(false);
  const [isHandlingCharge, setIsHandlingCharge] = useState(true);
  const [price, setPrice] = useState(0);
  const [inputPrice, setInputPrice] = useState<number | null>(null);

  const onChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPrice(Number(e.target.value));
    let num = Number(e.target.value);
    num = num / 1.1;

    if (isCoupon) num = num * 0.95;
    if (isHandlingCharge) num = num * 1.0155;

    let result = num;

    setPrice(result);
  };

  return (
    <>
      <Header />
      <section id="calculator" className="container">
        <div className="content-area">
          <div>{'￥' + Math.ceil(price)}</div>
        </div>
        <div className="input-area">
          <div className="btn-area">
            <button
              onClick={() => {
                setIsCoupon(!isCoupon);
                !isCoupon ? setPrice(price * 0.95) : setPrice(price / 0.95);
              }}
              className={isCoupon ? 'check-btn active' : 'check-btn'}
            >
              クーポン
            </button>
            <button
              onClick={() => {
                setIsHandlingCharge(!isHandlingCharge);
                !isHandlingCharge
                  ? setPrice(price * 1.0155)
                  : setPrice(price / 1.0155);
              }}
              className={isHandlingCharge ? 'check-btn active' : 'check-btn'}
            >
              手数料
            </button>
          </div>
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
      </section>
    </>
  );
};
