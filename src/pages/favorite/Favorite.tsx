import styled from "styled-components";
import { Header } from "../../components/Header";
import { RiFolderAddFill } from "react-icons/ri";
import { EditModal } from "../../components/modal/EditModal";
import { useEffect, useState } from "react";
import { categoryApi } from "../../api/categoryApi";
import { Category } from "./Category";

export const Favorite = () => {
  const [categories, setCategories] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const getAllCategories = () => {
    categoryApi
      .getAll()
      .then((res) => {
        setCategories(res.data.reverse());
      })
      .catch(() => alert("カテゴリの取得に失敗しました"));
  };

  const modalSubmitHandler = (text: string) => {
    categoryApi
      .create(text)
      .then(() => getAllCategories())
      .catch(() => alert("カテゴリの作成に失敗しました"));
  };

  // ユーザのカテゴリを取得する
  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <>
      <Header />
      <StyledFavorite id="favorite" className="container">
        <div className="content-area">
          <div>
            <div className="list-wrapper">
              <div className="list-title section-title">
                <h2 className="serif">Phrases</h2>
                <button
                  className="add-btn"
                  onClick={() => setModalIsOpen(true)}
                >
                  <RiFolderAddFill />
                </button>
              </div>
              <Category
                categories={categories}
                getAllCategories={getAllCategories}
              />
            </div>
          </div>
        </div>
      </StyledFavorite>
      <EditModal
        title="カテゴリ新規作成"
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        submitHandler={modalSubmitHandler}
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
      margin: 15px 0;
      &.section-title {
        margin-bottom: 30px;
      }
      & h2,
      h3 {
        grid-column: 2/3;
        font-size: 16px;
        vertical-align: middle;
      }
      & h2 {
        font-size: 20px;
        margin: 0;
      }
      & .add-btn {
        grid-column: 3/4;
        display: flex;
        width: 30px;
        font-size: 16px;
        align-items: center;
        padding: 0;
        column-gap: 5px;

        & span {
          white-space: nowrap;
        }
      }
    }

    & .button-wrapper {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      grid-column: 3/4;
      margin: 0 0 auto;
      color: #555;
      font-weight: normal;

      & > button {
        display: flex;
        width: 100%;
        min-width: 30px;
        max-width: 50px;
      }

      & .caution {
        color: #ff0000;
      }
    }
  }
`;
