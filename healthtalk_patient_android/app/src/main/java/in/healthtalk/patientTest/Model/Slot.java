package in.healthtalk.patientTest.Model;

import java.util.List;

public class Slot {
    String name,status,address;
    Integer slotInt;
    List<String> type;

    public Slot() {
    }

    public Slot(String name, String status, String address, Integer slotInt, List<String> type) {
        this.name = name;
        this.status = status;
        this.address = address;
        this.slotInt = slotInt;
        this.type = type;
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

    public Integer getSlotInt() {
        return slotInt;
    }

    public void setSlotInt(Integer slotInt) {
        this.slotInt = slotInt;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public List<String> getType() {
        return type;
    }

    public void setType(List<String> type) {
        this.type = type;
    }
}
