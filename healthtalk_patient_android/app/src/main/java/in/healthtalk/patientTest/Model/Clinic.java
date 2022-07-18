package in.healthtalk.patientTest.Model;

public class Clinic {
    String name,address,img,city,id;

    public Clinic() {
    }

    public Clinic(String name, String address, String img, String city, String id) {
        this.name = name;
        this.address = address;
        this.img = img;
        this.city = city;
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}
