package in.healthtalk.patientTest.Model;

public class Date {
    String  date,dayName,monthName;
    Integer dayInt,isTrue,isFalse,isBooked;

    public Date() {

    }

    public Date(String date, String dayName, String monthName, Integer dayInt, Integer isTrue, Integer isFalse, Integer isBooked) {
        this.date = date;
        this.dayName = dayName;
        this.monthName = monthName;
        this.dayInt = dayInt;
        this.isTrue = isTrue;
        this.isFalse = isFalse;
        this.isBooked = isBooked;
    }

    public String getDate() {
        return date;

    }

    public void setDate(String date) {
        this.date = date;

    }

    public String getDayName() {
        return dayName;
    }

    public void setDayName(String dayName) {
        this.dayName = dayName;

    }

    public String getMonthName() {
        return monthName;

    }

    public void setMonthName(String monthName) {
        this.monthName = monthName;

    }

    public Integer getDayInt() {
        return dayInt;

    }

    public void setDayInt(Integer dayInt) {
        this.dayInt = dayInt;

    }

    public Integer getIsTrue() {
        return isTrue;
    }

    public void setIsTrue(Integer isTrue) {
        this.isTrue = isTrue;
    }

    public Integer getIsFalse() {
        return isFalse;
    }

    public void setIsFalse(Integer isFalse) {
        this.isFalse = isFalse;
    }

    public Integer getIsBooked() {
        return isBooked;
    }

    public void setIsBooked(Integer isBooked) {
        this.isBooked = isBooked;
    }
}
