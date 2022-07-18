package in.healthtalk.patientTest.Model;

import com.google.firebase.Timestamp;

public class History {

    Timestamp createAt;
    String img;

    public History() {
    }

    public History(Timestamp createAt, String img) {
        this.createAt = createAt;
        this.img = img;
    }

    public Timestamp getCreateAt() {
        return createAt;
    }

    public void setCreateAt(Timestamp createAt) {
        this.createAt = createAt;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }
}
