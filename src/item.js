import React, { PureComponent } from 'react';
import styles from './index.less'
const monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

class Item extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      currentDay: '',
      currentMonth: '', 
      currentYear: '',
      dayList: []
    }
    this.initCalendar = this.initCalendar.bind(this);
    }

    componentWillMount() {
        console.log(styles["day"])
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    	const { date } = this.props
      this.initCalendar(date)
    }

    // 获取当前date的当月第一天的字符串形式
    getMonthFirstDate(date) {
      let nowYear = date.getFullYear() + '';
      let nowMonth = date.getMonth()+1 + '';
      nowMonth = nowMonth.length === 1 ? '0' + nowMonth : nowMonth;
      return  `${nowYear}-${nowMonth}-01`
    }

    // 获取当前date的字符串形式
    getDateString(date) {
      let nowYear = date.getFullYear() + '';
      let nowMonth = date.getMonth()+1 + '';
      let day = date.getDate() + '';
      nowMonth = nowMonth.length === 1 ? '0' + nowMonth : nowMonth;
      day = day.length === 1 ? '0' + day : day;
      return  `${nowYear}-${nowMonth}-${day}`
    }
    getThisMonth(date, noDate) {
      if (new Date(date).getMonth() !== new Date(noDate).getMonth()) {
        return false
      }
      return true
    }

    // 初始化日历
    initCalendar(currentDate) {
      let nowDate = currentDate ? currentDate : new Date();
      let nowMonthFirstDate = this.getMonthFirstDate(nowDate) // 获取当月1号日期
      let nowWeek = new Date(nowMonthFirstDate).getDay() ? new Date(nowMonthFirstDate).getDay() : 0; // 获取星期
      let newDateList = []; // 创建日期数组
      let newAllDateList = []
      let startDay =  1 - nowWeek; // 开始日期的下标  以为 setDate(0)是上个月最后一天  所以是2-nowWeek
      let showDayLength = nowWeek < 6 || new Date(nowDate).getMonth() === 1 ? 35 : 42;  // 如果5行能显示下一个月 就只显示5行,二月只需5行就够了
   
      // 循环处理 获取日历上应该显示的日期
      for (let i = startDay; i < startDay + showDayLength; i++) {
          let date = new Date(new Date(nowMonthFirstDate).setDate(i)); // 获取时间对象
          let day = date.getDate() // 小于9的数字前面加0
          let dayObject = {
              date: this.getDateString(date),
              day,
              className: '',
              isThisMonth: this.getThisMonth(date, nowDate)
          }
          if (date.toDateString() === new Date().toDateString()) {
              dayObject.className = 'today'
          }
          newDateList.push(dayObject)
          if (newDateList.length === 7) {
            newAllDateList.push(newDateList)
            newDateList = []
          }
          if (i === startDay + showDayLength -1) {
            if (newDateList.length !== 0) { 
              newAllDateList.push(newDateList)
              newDateList = []
            }
          }
      }

      this.setState((pre) => {
        return {
          dayList: newAllDateList,
          currentDay: nowDate.getDate(),
          currentMonth: nowDate.getMonth() + 1 >= 10 ? nowDate.getMonth() + 1 : '0' + (nowDate.getMonth() + 1),
          currentYear: nowDate.getFullYear(),
        }
      })
    }

    selectDate=(date) => {
    	if (this.props.selectDate) {
    		this.props.selectDate(date)
    	}
    }

    render() {
    	const { dayList,currentYear, currentMonth } = this.state
    	const { depDate, returnDate, minDate, maxDate, lang, id } = this.props
      return(
        <div className="wrap-body" key={id} id={id}>
          <div className="month-item-title">
          {
            lang === 'EN' ?
            currentYear + "-" + currentMonth
            :
            monthArr[Number(currentMonth) - 1]+ " " + currentYear
          }
          </div>
         
            <div className = "day-container">
               {
                dayList.map((dayList1, index) => {
                  return (
	                  <div className="line-item" key={index}>
                      {
                        dayList1.map((dayObject, index1) => {
                          return (
                            <div key={index1} className={(depDate&&returnDate&&new Date(dayObject.date).getTime() > new Date(depDate).getTime()&&new Date(dayObject.date).getTime() < new Date(returnDate).getTime()&&dayObject.isThisMonth) ? "day-item" + " " + "daytoday-position-all" : "day-item"
                            }>
                              {
                              (depDate&&(depDate === dayObject.date || returnDate === dayObject.date)) ?
                              <>
                                {
                                  (!dayObject.isThisMonth) ?
                                  <div className = "day"></div>
                                  :
                                  <>
                                  {
                                    (depDate&&returnDate&&depDate !== ''&&returnDate !== '') ?
                                    <>
                                      {
                                        depDate === dayObject.date&&depDate !== returnDate&&
                                        <>
                                          <div className = "daytoday daytoday-position-3"></div>
                                          <div className = "daytoday daytoday-position" key = {index} onClick={() => {this.selectDate(dayObject.date)}}>
                                            <div className = "daytoday-rt">{dayObject.day}</div>
                                          </div>
                                        </>
                                      }
                                      {
                                        returnDate === dayObject.date&&depDate !== returnDate&&
                                        <>
                                          {
                                            new Date(returnDate).getDay() - new Date(depDate).getDay() === 1 ?
                                            <div className = "daytoday daytoday-position-4 daytoday-position-5"></div>
                                            :
                                            <div className = "daytoday daytoday-position-4"></div>
                                          }
                                          <div className = "daytoday daytoday-position-1" onClick={() => {this.selectDate(dayObject.date)}}>
                                            <div className = "daytoday-rt">{dayObject.day}</div>
                                          </div>
                                        </>
                                      }
                                      {
                                        depDate === returnDate&&
                                        <div className = "daytoday" onClick={() => {this.selectDate(dayObject.date)}}>
                                          <div className = "daytoday-rt">{dayObject.day}</div>
                                          <div className="daytoday-position-6"></div>
                                        </div>
                                      }
                                    </>
                                    :
                                    <div className = "daytoday" onClick={() => {this.selectDate(dayObject.date)}}>{dayObject.day}</div>
                                  }
                                  </>
                                }
                                </>
                                :
                                <>
                                  {
                                    (!dayObject.isThisMonth) ?
                                    <div className = "day"></div>
                                    :
                                    <>
                                      {
                                        (new Date(dayObject.date) < new Date(minDate) || new Date(dayObject.date) > new Date(maxDate)) ?
                                        <div className = "daydisable">{dayObject.day}</div>
                                        :
                                        <div className = "day" onClick={() => {this.selectDate(dayObject.date)}}>{dayObject.day}</div>
                                      }
                                    </>
                                  }
                                </>
                              }
                            </div>
                          )
                        })
                      }
	                  </div>
                	)
                })
              }
            </div>
       
        </div>
      )
    }
}

export default Item;