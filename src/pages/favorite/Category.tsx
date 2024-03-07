import { RiPlayListAddLine } from 'react-icons/ri';
import { TypeCategory } from '../../type';
import { Phrase } from './Phrase';
import { useState } from 'react';
import { EditModal } from '../../components/modal/EditModal';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { phraseApi } from '../../api/phraseApi';
import { categoryApi } from '../../api/categoryApi';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';

export const Category = ({
  categories,
  getAllCategories,
}: {
  categories: Array<TypeCategory>;
  getAllCategories: () => void;
}) => {
  const [categoryTitle, setCategoryTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
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

  const modalSubmitHandler = (text: string) => {
    isNew
      ? phraseApi
          .create(categoryId, { title: text })
          .then(() => getAllCategories())
          .catch(() => alert('カテゴリの取得に失敗しました'))
      : categoryApi
          .update(categoryId, { title: text })
          .then(() => getAllCategories())
          .catch(() => alert('カテゴリの編集に失敗しました'));
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
                    <MenuItem>
                      <MenuButton>New File</MenuButton>
                    </MenuItem>
                    <MenuItem>
                      <MenuButton>Save</MenuButton>
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
        title={isNew ? 'フレーズを追加' : 'カテゴリを編集'}
        defaultValue={categoryTitle}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        submitHandler={modalSubmitHandler}
      />
    </>
  );
};
