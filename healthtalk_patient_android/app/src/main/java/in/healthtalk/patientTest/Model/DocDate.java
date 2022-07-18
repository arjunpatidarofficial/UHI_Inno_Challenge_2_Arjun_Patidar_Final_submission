package in.healthtalk.patientTest.Model;

public class DocDate {
    String name,status,dayName,monthName,date;
    Integer dayInt;


    public DocDate() {
    }

    public DocDate(String name, String status, String dayName, String monthName, String date, Integer dayInt) {
        this.name = name;
        this.status = status;
        this.dayName = dayName;
        this.monthName = monthName;
        this.date = date;
        this.dayInt = dayInt;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getMonthName() {
        return monthName;
    }

    public void setMonthName(String monthName) {
        this.monthName = monthName;
    }

    public String getDayName() {
        return dayName;
    }

    public void setDayName(String dayName) {
        this.dayName = dayName;
    }

    public Integer getDayInt() {
        return dayInt;
    }

    public void setDayInt(Integer dayInt) {
        this.dayInt = dayInt;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}