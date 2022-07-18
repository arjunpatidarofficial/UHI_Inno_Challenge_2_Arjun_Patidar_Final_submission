package in.healthtalk.patientTest.Model;

public class Test {
    private  String name,sample;
    private  Integer price;

    public Test(String name, String sample, Integer price) {
        this.name = name;
        this.sample = sample;
        this.price = price;
    }

    public Test() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSample() {
        return sample;
    }

    public void setSample(String sample) {
        this.sample = sample;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }
}
