import styled from 'styled-components';
import { Header } from '../../components/Header';
import { RiPlayListAddLine } from 'react-icons/ri';

export const Favorite = () => {
  const onClickAddPhrase = () => {};

  return (
    <>
      <Header />
      <StyledFavorite id="favorite" className="container">
        <div className="content-area">
          <div>
            <div className="list-wrapper">
              <h2>お気に入り言語</h2>
              <ul>
                <li>英語</li>
                <li>中国語</li>
              </ul>
            </div>
            <div className="list-wrapper">
              <div className="list-title">
                <h2>お気に入りフレーズ</h2>
                <button className="add-btn" onClick={onClickAddPhrase}>
                  <RiPlayListAddLine />
                  <span>追加</span>
                </button>
              </div>
              <ul>
                <li>今日はとてもいい天気ですね</li>
                <li>
                  明日は雪が降るかもしれません。電車の遅延等がないかご確認ください。
                </li>
              </ul>
            </div>
          </div>
        </div>
      </StyledFavorite>
    </>
  );
};

const StyledFavorite = styled.section`
  height: auto;

  & .list-wrapper {
    width: 80%;
    text-align: center;

    & .list-title {
      display: flex;
      justify-content: center;
      column-gap: 15px;
      margin-left: 65px;
      & h2 {
        font-size: 20px;
        vertical-align: middle;
      }
      & .add-btn {
        display: flex;
        width: 50px;
        font-size: 12px;
        align-items: center;
        padding: 0;
        column-gap: 5px;

        & span {
          white-space: nowrap;
        }
      }
    }

    & ul {
      & li {
        font-weight: normal;
        text-align: center;
        margin-top: 5px;
        font-size: 16px;
        border-bottom: dashed #555 1px;
        &:last-of-type {
          margin-bottom: 30px;
        }
      }
    }
  }
`;
