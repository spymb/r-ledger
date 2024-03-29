import React from 'react';
import Icon from '../Icon';
import styled from 'styled-components';
import {mainColor} from '../../lib/color';
import {RecordItem, useRecords} from '../../hooks/useRecords';
import {Tag} from '../../hooks/useTags';

const Wrapper = styled.ol`
  box-shadow: inset 0 5px 5px -5px rgba(0, 0, 0, 0.1);
  margin-top: 10px;

  > div {
    justify-content: center;
    display: flex;
    padding: 10px 20px;
  }

  > li {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    background: white;
    border-bottom: 1px solid #c4c4c4;

    .icon-wrapper {
      width: 40px;
      height: 40px;
      background-color: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 20px;
      margin-right: 10px;

      .icon {
        fill: ${mainColor};
      }
    }

    .info {
      flex: 1;

      .text-info {
        display: flex;
        align-items: center;

        .percent {
          font-size: 12px;
          margin-left: 6px;
        }

        .amount {
          margin-left: auto;
        }
      }

      .percent-bar {
        margin: 4px 0;
        height: 6px;
        width: 100%;
        border-radius: 5px;
        background-color: ${mainColor};
      }
    }
  }
`;
const FallBackMessage = styled.div`
  font-size: 20px;
  line-height: 160px;
  text-align: center;
`;

interface Props {
  day: Date;
  dateType: 'date' | 'month' | 'year';
  category: '-' | '+';
}

const RankList: React.FunctionComponent<Props> = (props) => {
  const {dateType, day, category} = props;
  const {getRecordsByTime, getRecordsByCategory, records} = useRecords();
  const getSumForTags = (records: RecordItem[]) => {
    const initial: { [tagID: string]: number } = {};
    return records.reduce((pre, record) => {
      if (pre[record.tagID] !== undefined) {
        pre[record.tagID] += record.amount;
      } else {
        pre[record.tagID] = record.amount;
      }
      return pre;
    }, initial);
  };

  const recordsByTime = getRecordsByTime(day, dateType);
  const recordsByCategory = getRecordsByCategory(recordsByTime, category);
  const sumForTags = getSumForTags(recordsByCategory);

  const kvArray = Object.entries(sumForTags);
  kvArray.sort((a, b) => b[1] - a[1]);
  const total = kvArray.reduce((pre, [, sum]) => pre + sum, 0);
  const getTagFromRecords = (id: number) => {
    const array = records.map(record => {
      if(record.tagID === id)
        return {icon: record.icon, name: record.name}
    })
    return array.filter(Boolean)[0]
  }

  const tagRankData = kvArray.map(item => {
    const [tagID, sum] = item;
    return {
      tag: getTagFromRecords(parseInt(tagID)) as Tag,
      sum,
      percent: sum / total * 100
    };
  });

  return (
    <Wrapper>
      <div>
        {category === '-' ? '支出' : '收入'}排行
      </div>

      {tagRankData.length === 0 ? <FallBackMessage>暂无数据</FallBackMessage> :
        tagRankData.map(item => {
          return (
            <li className="rank-list-item" key={item.tag.name}>
              <div className="icon-wrapper">
                <Icon className="icon" name={item.tag.icon}/>
              </div>

              <div className="info">
                      <span className="text-info">
                        <span className="icon-name">{item.tag.name}</span>
                        <span className="percent">{item.percent.toFixed(2)}%</span>
                        <span className="amount">￥{item.sum}</span>
                      </span>

                <div className="percent-bar" style={{width: item.percent + '%'}}/>
              </div>

            </li>
          );
        })}
    </Wrapper>
  );
};

export {RankList};