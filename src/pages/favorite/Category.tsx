import { TypeCategory } from '../../type';
import { Phrase } from './Phrase';
import { useState } from 'react';
import { EditModal } from '../../components/modal/EditModal';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { phraseApi } from '../../api/phraseApi';
import { categoryApi } from '../../api/categoryApi';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';

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
        .catch(() => alert('カテゴリの削除に失敗しました'));
    }
  };

  const modalSubmitHandler = (text: string) => {
    isNew
      ? phraseApi
          .create(category._id, { title: text })
          .then(() => getAllCategories())
          .catch(() => alert('カテゴリの取得に失敗しました'))
      : categoryApi
          .update(category._id, { title: text })
          .then(() => getAllCategories())
          .catch(() => alert('カテゴリの編集に失敗しました'));
  };

  return (
    <>
      <li key={category._id}>
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
        {isOpen ? <Phrase key={category._id} category={category} /> : <></>}
      </li>

      <EditModal
        title={isNew ? 'フレーズを追加' : 'カテゴリを編集'}
        defaultValue={isNew ? '' : category.title}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        submitHandler={modalSubmitHandler}
      />
    </>
  );
};
