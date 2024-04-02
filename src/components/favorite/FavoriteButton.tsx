import { SetStateAction, useEffect, useRef, useState } from "react";
import { BiBookmarkPlus, BiSolidBookmarkPlus } from "react-icons/bi";
import { TypeCategory } from "../../type";
import styled from "styled-components";
import { phraseApi } from "../../api/phraseApi";
import { categoryApi } from "../../api/categoryApi";

export const FavoriteButton = ({
  isFavorite,
  phraseTitle,
  setIsFavorite,
}: {
  isFavorite: boolean;
  phraseTitle: string;
  setIsFavorite: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const innerContent = useRef<HTMLDivElement>(null);
  const [isAppeared, setIsAppeared] = useState(false);
  const [categories, setCategories] = useState([]);

  const onClickFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsAppeared(!isAppeared);
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const categoryId = e.currentTarget.categories.value;

    phraseApi
      .create(categoryId, { title: phraseTitle })
      .then(() => setIsFavorite(true))
      .catch((err) => alert(err.data))
      .finally(() => setIsAppeared(false));
  };

  document.addEventListener("click", (e) => {
    if (!innerContent.current) return;

    if (!isAppeared) return;

    if (!innerContent.current.contains(e.target as Node)) {
      setIsAppeared(false);
    }
  });

  useEffect(() => {
    categoryApi
      .getAll()
      .then((res) => setCategories(res.data.reverse()))
      .catch((err) => alert(err.data));
  }, []);

  return (
    <StyledFavoriteButton>
      {isFavorite ? (
        <button
          className="favorite-btn favorite-btn--yellow"
          onClick={(e) => onClickFavorite(e)}
        >
          <BiSolidBookmarkPlus />
        </button>
      ) : (
        <button className="favorite-btn" onClick={(e) => onClickFavorite(e)}>
          <BiBookmarkPlus />
        </button>
      )}
      {isAppeared && (
        <div className="favorite-add-menu" ref={innerContent}>
          <form onSubmit={(e) => submitHandler(e)}>
            <h4 className="add-title">フレーズ登録</h4>
            <label htmlFor="select-category">カテゴリ:</label>
            <div>
              <select name="categories" id="select-category">
                {categories.map((category: TypeCategory) => (
                  <option value={category._id} key={category._id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
            <button className="add-btn">追加</button>
          </form>
        </div>
      )}
    </StyledFavoriteButton>
  );
};

const StyledFavoriteButton = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;

  & > .favorite-btn {
    width: 50px;
    height: 50px;

    &--yellow {
      color: #ffcc00;
      & svg {
        stroke: #000;
        stroke-width: 0.5;
      }
    }
  }

  & .favorite-add-menu {
    position: absolute;
    right: 0;
    background-color: #fff;
    border: 2px solid #555;
    border-radius: 10px;
    padding: 10px 30px;
    z-index: 999;

    & > form {
      display: flex;
      flex-direction: column;
      row-gap: 15px;
      & > .add-title {
        text-align: center;
      }

      & > div {
        width: fit-content;
        position: relative;
        &::before {
          content: "";
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 7px 7px 0 7px;
          border-color: #555 transparent transparent transparent;
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          pointer-events: none;
        }
        & > select {
          width: 200px;
          font-weight: normal;
          border: 2px solid #555;
          padding: 2px 30px 2px 15px;
          border-radius: 5px;
        }
      }
      & label {
        font-weight: normal;
        margin-bottom: -10px;
      }
    }
  }
`;
