import styled from "styled-components";
import { Header } from "../../components/Header";
import { RiPlayListAddLine } from "react-icons/ri";
import { EditModal } from "../../components/modal/EditModal";
import { useEffect, useState } from "react";
import { categoryApi } from "../../api/categoryApi";
import { TypeCategory } from "../../type";
import { Phrase } from "./Phrase";
import { phraseApi } from "../../api/phraseApi";

export const Favorite = () => {
  const [categories, setCategories] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [categoryId, setCategoryId] = useState("");
  const [categoryTitle, setCategoryTitle] = useState("");
  const [isAddPhrase, setIsAddPhrase] = useState(false);

  const getAllCategories = () => {
    categoryApi
      .getAll()
      .then((res) => {
        setCategories(res.data.reverse());
      })
      .catch(() => alert("カテゴリの取得に失敗しました"));
  };

  const modalSubmitCategory = (text: string) => {
    isNew
      ? // 新しくカテゴリを追加する
        categoryApi
          .create(text)
          .then(() => getAllCategories())
          .catch(() => alert("カテゴリの作成に失敗しました"))
      : // カテゴリを編集する
        categoryApi
          .update(categoryId, { title: text })
          .then(() => getAllCategories())
          .catch(() => alert("カテゴリの編集に失敗しました"));
  };

  const modalSubmitPhrase = (text: string) => {
    // ボタンの押されたカテゴリにフレーズを追加する
    phraseApi
      .create(categoryId, { title: text })
      .then(() => getAllCategories())
      .catch(() => alert("カテゴリの作成に失敗しました"));
  };

  // ユーザのカテゴリを取得する
  useEffect(() => {
    getAllCategories();
  }, []);

  const onClickAddCategory = () => {
    setCategoryTitle("");
    setCategoryId("");
    setIsNew(true);
    setModalIsOpen(true);
    setIsAddPhrase(false);
  };

  const onClickAddPhrase = () => {
    setIsNew(true);
    setModalIsOpen(true);
    setIsAddPhrase(true);
  };

  return (
    <>
      <Header />
      <StyledFavorite id="favorite" className="container">
        <div className="content-area">
          <div>
            <div className="list-wrapper">
              <div className="list-title">
                <h2 className="serif">Phrases</h2>
                <button className="add-btn" onClick={onClickAddCategory}>
                  <RiPlayListAddLine />
                  <span>追加</span>
                </button>
              </div>
              {categories.length !== 0 ? (
                <ul>
                  {categories.map((category: TypeCategory) => (
                    <li>
                      <div className="list-title">
                        <h3>{category.title}</h3>
                        <button className="add-btn" onClick={onClickAddPhrase}>
                          <RiPlayListAddLine />
                          <span>追加</span>
                        </button>
                      </div>
                      <Phrase
                        category={category}
                        getAllCategories={getAllCategories}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="caution-text">カテゴリがありません</p>
              )}
            </div>
          </div>
        </div>
      </StyledFavorite>
      <EditModal
        defaultValue={categoryTitle}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        submitHandler={isAddPhrase ? modalSubmitPhrase : modalSubmitCategory}
      />
    </>
  );
};

const StyledFavorite = styled.section`
  height: auto;

  & .list-wrapper {
    width: 80%;
    text-align: center;

    & h2 {
      margin: 15px 0 30px;
      letter-spacing: 0.05em;
    }

    & .caution-text {
      font-weight: normal;
      padding: 0 0 15px 0;
      border-bottom: dashed #555 1px;
      margin-bottom: 30px;
    }

    & .list-title {
      display: grid;
      grid-template-columns: 10% 80% 10%;
      & h3 {
        grid-column: 2/3;
        font-size: 16px;
        vertical-align: middle;
        margin-bottom: 15px;
      }
      & .add-btn {
        grid-column: 3/4;
        display: flex;
        width: 60px;
        font-size: 16px;
        align-items: center;
        padding: 0;
        column-gap: 5px;

        & span {
          white-space: nowrap;
        }
      }
    }

    & .phrase-list {
      & li {
        display: grid;
        grid-template-columns: 10% 80% 10%;
        font-weight: normal;
        padding: 5px 0;
        margin-top: 5px;
        font-size: 16px;
        border-bottom: dashed #555 1px;
        cursor: pointer;
        &:last-of-type {
          margin-bottom: 30px;
        }

        & > p,
        & > div {
          grid-column: 2/3;
        }

        & .button-wrapper {
          display: flex;
          align-items: center;
          width: 100%;
          height: 100%;
          min-width: 50px;
          grid-column: 3/4;
          grid-row: 1/3;
          margin: 0 0 auto;
          color: #555;

          & > button {
            display: flex;
            width: 100%;
          }

          & .caution {
            color: #ff0000;
          }
        }
      }
    }
  }
`;
