package in.healthtalk.patientTest.Model;

import com.google.firebase.Timestamp;

public class Appointment {
    String name,number,doctorId,status,type,date,slot,patientId;
    Timestamp presCreateAt;

    public Appointment() {
    }

    public Appointment(String name, String number, String doctorId, String status, String type, String date, String slot, String patientId, Timestamp presCreateAt) {
        this.name = name;
        this.number = number;
        this.doctorId = doctorId;
        this.status = status;
        this.type = type;
        this.date = date;
        this.slot = slot;
        this.patientId = patientId;
        this.presCreateAt = presCreateAt;
    }

    public Timestamp getPresCreateAt() {
        return presCreateAt;
    }

    public void setPresCreateAt(Timestamp presCreateAt) {
        this.presCreateAt = presCreateAt;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getSlot() {
        return slot;
    }

    public void setSlot(String slot) {
        this.slot = slot;
    }
}
