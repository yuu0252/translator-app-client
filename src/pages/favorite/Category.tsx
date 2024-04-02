import { TypeCategory, TypePhrase } from "../../type";
import { Phrase } from "./Phrase";
import { useEffect, useState } from "react";
import { EditModal } from "../../components/modal/EditModal";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { phraseApi } from "../../api/phraseApi";
import { categoryApi } from "../../api/categoryApi";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

export const Category = ({
  category,
  getAllCategories,
}: {
  category: TypeCategory;
  getAllCategories: () => void;
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [phrases, setPhrases] = useState([]);

  // カテゴリ内のフレーズを取得する
  const getAllPhrases = (category: TypeCategory) => {
    phraseApi
      .getAll(category._id)
      .then((res) => {
        setPhrases(res.data.reverse());
      })
      .catch(() => {
        alert(`カテゴリ:${category.title}のフレーズ取得に失敗しました`);
      });
  };

  // カテゴリ内にフレーズを追加
  const onClickAddPhrase = () => {
    setIsNew(true);
    setModalIsOpen(true);
  };

  const onClickEditCategory = () => {
    setIsNew(false);
    setModalIsOpen(true);
  };

  const onClickDeleteCategory = (category: TypeCategory) => {
    // カテゴリの削除はユーザに確認してから実行する
    const answer = confirm(
      `カテゴリ「${category.title}」を削除してもよろしいですか？`
    );
    if (answer) {
      categoryApi
        .delete(category._id)
        .then(() => getAllCategories())
        .catch((err) => alert(err.data));
    }
  };

  const modalSubmitHandler = (text: string) => {
    isNew
      ? phraseApi
          .create(category._id, { title: text })
          .then(() => getAllPhrases(category))
          .catch((err) => alert(err.data))
      : categoryApi
          .update(category._id, { title: text })
          .then(() => getAllCategories())
          .catch((err) => alert(err.data));
  };

  useEffect(() => {
    getAllPhrases(category);
  }, []);

  return (
    <>
      <div className="list-title">
        <h3 onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}
          {` ${category.title}`}
        </h3>

        <div className="button-wrapper">
          <Menu
            className="btn-menu"
            menuButton={
              <MenuButton>
                <HiOutlinePencilAlt />
              </MenuButton>
            }
          >
            <MenuItem onClick={() => onClickAddPhrase()}>
              <MenuButton>フレーズを追加</MenuButton>
            </MenuItem>
            <MenuItem onClick={() => onClickEditCategory()}>
              <MenuButton>カテゴリ名を編集</MenuButton>
            </MenuItem>
            <MenuItem onClick={() => onClickDeleteCategory(category)}>
              <MenuButton>カテゴリを削除</MenuButton>
            </MenuItem>
          </Menu>
        </div>
      </div>
      {isOpen && (
        <ul className="phrase-list">
          {phrases.length !== 0 ? (
            phrases.map((phrase: TypePhrase) => (
              <li key={phrase._id}>
                <Phrase
                  category={category}
                  phrase={phrase}
                  getAllPhrases={() => getAllPhrases(category)}
                />
              </li>
            ))
          ) : (
            <li>
              <div className="phrase-text">
                <p className="caution-text">フレーズがありません</p>
              </div>
            </li>
          )}
        </ul>
      )}

      <EditModal
        title={isNew ? "フレーズを追加" : "カテゴリを編集"}
        defaultValue={isNew ? "" : category.title}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        submitHandler={modalSubmitHandler}
      />
    </>
  );
};
