import styled from 'styled-components';
import React, {ReactNode} from 'react';
import {useTags} from '../../../hooks/useTags';
import Icon from '../../../components/Icon';

const Wrapper = styled.section`
  font-size: 12px;
  flex: 5;
  overflow: auto;
  border-bottom: 1px solid #333333;

  ::-webkit-scrollbar {
    display: none;
  }

  > div {
    border: 1px solid red
  }

  > ol {
    display: flex;
    flex-wrap: wrap;
    padding: 4px 0;

    > li {
      width: 20%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 4px 0;
      cursor: pointer;

      > div {
        width: 70%;
        height: 45px;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;

        .icon {
          width: 26px;
          height: 26px;
        }
      }

      > span {
        margin-top: 3px;
      }

      &.selected {
        color: #005DFF;

        > div {
          background: #E8F1FF;

          .icon {
            fill: #005DFF;
          }
        }
      }
    }

    > a {
      width: 20%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 4px 0;
      cursor: pointer;

      > div {
        width: 70%;
        height: 45px;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;

        .icon {
          width: 26px;
          height: 26px;
        }
      }

      > span {
        margin-top: 3px;
      }
    }
  }

`;


type Props = {
  // 选中若干标签
  value: number[]
  onChange: (selected: number[]) => void
  // 分类tags
  category: '-' | '+'
  // 设置或添加
  child2?: ReactNode
}

const TagsSection: React.FC<Props> = (props) => {
  const {tags} = useTags();
  // 分类tags
  const tagsByType = tags.filter(tag => tag.type === props.category);
  // 选中若干标签
  const selectedTagIDs = props.value;
  const onToggleTag = (tagID: number) => {
    const index = selectedTagIDs.indexOf(tagID);
    if (index >= 0) {
      props.onChange(selectedTagIDs.filter(ID => ID !== tagID));
    } else {
      props.onChange([...selectedTagIDs, tagID]);
    }
  };
  const getClass = (tagID: number) => selectedTagIDs.indexOf(tagID) >= 0 ? 'selected' : '';


  return (
    <Wrapper>
      <ol>
        {
          tagsByType.map(tag => {
            return (
              <li key={tag.id} onClick={() => onToggleTag(tag.id)}
                  className={getClass(tag.id)}>
                <div>
                  <Icon className="icon" name={tag.icon}/>
                </div>
                <span>{tag.name}</span>
              </li>
            );
          })}

        {props.child2}
      </ol>
    </Wrapper>
  );
};


export {TagsSection};