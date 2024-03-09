import { TypeCategory } from "../../type";
import { Phrase } from "./Phrase";
import { useState } from "react";
import { EditModal } from "../../components/modal/EditModal";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { phraseApi } from "../../api/phraseApi";
import { categoryApi } from "../../api/categoryApi";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";

export const Category = ({
  categories,
  getAllCategories,
}: {
  categories: Array<TypeCategory>;
  getAllCategories: () => void;
}) => {
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isNew, setIsNew] = useState(true);

  // カテゴリ内にフレーズを追加
  const onClickAddPhrase = (category: TypeCategory) => {
    setCategoryId(category._id);
    setIsNew(true);
    setModalIsOpen(true);
  };

  const onClickEditCategory = (category: TypeCategory) => {
    setCategoryId(category._id);
    setCategoryTitle(category.title);
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
        .catch(() => alert("カテゴリの削除に失敗しました"));
    }
  };

  const modalSubmitHandler = (text: string) => {
    isNew
      ? phraseApi
          .create(categoryId, { title: text })
          .then(() => getAllCategories())
          .catch(() => alert("カテゴリの取得に失敗しました"))
      : categoryApi
          .update(categoryId, { title: text })
          .then(() => getAllCategories())
          .catch(() => alert("カテゴリの編集に失敗しました"));
  };

  return (
    <>
      {categories.length !== 0 ? (
        <ul>
          {categories.map((category: TypeCategory) => (
            <li key={category._id}>
              <div className="list-title">
                <h3>{category.title}</h3>

                <div className="button-wrapper">
                  <Menu
                    className="btn-menu"
                    menuButton={
                      <MenuButton>
                        <HiOutlinePencilAlt />
                      </MenuButton>
                    }
                  >
                    <MenuItem onClick={() => onClickAddPhrase(category)}>
                      <MenuButton>フレーズを追加</MenuButton>
                    </MenuItem>
                    <MenuItem onClick={() => onClickEditCategory(category)}>
                      <MenuButton>カテゴリ名を編集</MenuButton>
                    </MenuItem>
                    <MenuItem onClick={() => onClickDeleteCategory(category)}>
                      <MenuButton>カテゴリを削除</MenuButton>
                    </MenuItem>
                  </Menu>
                </div>
              </div>
              <Phrase key={category._id} category={category} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="caution-text">カテゴリがありません</p>
      )}
      <EditModal
        title={isNew ? "フレーズを追加" : "カテゴリを編集"}
        defaultValue={isNew ? "" : categoryTitle}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        submitHandler={modalSubmitHandler}
      />
    </>
  );
};
