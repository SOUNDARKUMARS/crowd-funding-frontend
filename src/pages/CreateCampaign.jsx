import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomBtn } from "../components";
import { money } from "../assets";
import FormField from "../components/FormField";
import { DatePicker, Input, Select, SelectItem } from "@heroui/react";
import { Cloudinary } from "@cloudinary/url-gen";

import { today, getLocalTimeZone, parseDate } from "@internationalized/date";
import axios from "axios";
import api from "../API/api";
import Loader from "../components/Loader";

function CreateCampaign() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const itemDetails = state?.item;
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState(itemDetails?.campaign_images || []);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [imageUrl, setImageUrl] = useState(itemDetails?.img_url || "");
  const [form, setForm] = useState({
    title: itemDetails?.title || "",
    description: itemDetails?.description || "",
    target: itemDetails?.goal_amount || "",
  });

  useEffect(() => {
    if (itemDetails) {
      setStartDate(
        parseDate(new Date(itemDetails?.start_date).toISOString().split("T")[0])
      );
      const deadline = itemDetails?.deadline.split("-");
      setEndDate(
        parseDate(deadline[0] + "-" + deadline[1] + "-" + deadline[2])
      ); //"yyyy-mm-dd"
    }
  }, [itemDetails]);

  const cld = new Cloudinary({ cloud: { cloudName: "dceod41m6" } });

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/admin/get-categories");
        if (response.status === 200) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const data = localStorage.getItem("access_token");
    if (!data) {
      navigate("/profile");
    }
  }, [navigate]);

  const handleMultipleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ml_default");

      try {
        setIsLoading(true);
        setLoadingMsg("Uploading...");
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/dceod41m6/image/upload`,
          formData
        );
        uploadedUrls.push(response?.data.secure_url);
      } catch (error) {
        console.error(
          "Error uploading image:",
          error.response?.data || error.message
        );
        alert(
          `Failed to upload image: ${
            error.response?.data?.error?.message || "Please try again."
          }`
        );
      }
    }

    setImages(uploadedUrls);
    setLoadingMsg("");
    setIsLoading(false);
  };

  const handleUpdateCampaign = async () => {
    const response = await api.put(`/update-campaign/${itemDetails.id}`, {
      campaign_images: images,
      title: form.title,
      description: form.description,
      target: form.target,
      deadline: `${endDate.year}-${endDate.month}-${endDate.day}`,
      start_date: `${startDate.year}-${startDate.month}-${startDate.day}`,
      thumbnail_img: imageUrl,
      category_id: selectedCategory,
    });
    console.log(response);
  };

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleCreateCampaign = async () => {
    try {
      setLoadingMsg("Creating Campaign...");
      setIsLoading(true);
      const res = await api.post("/create-campaign", {
        title: form.title,
        desc: form.description,
        target: form.target,
        deadline: `${endDate.year}-${endDate.month}-${endDate.day}`,
        start_date: `${startDate.year}-${startDate.month}-${startDate.day}`,
        thumbnail_img: imageUrl,
        category_id: selectedCategory,
        campaign_images: images,
      });
      setIsLoading(false);
      setLoadingMsg("");
      if (res.status === 201) {
        alert("Campaign created!");
        navigate("/");
      }
    } catch (error) {
      setIsLoading(false);
      setLoadingMsg("");
      alert("Campaign creation failed");
      console.error("Failed to create campaign", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); // Replace with your actual preset name

    try {
      setIsLoading(true);
      setLoadingMsg("Uploading...");
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dceod41m6/image/upload`,
        formData
      );
      setImageUrl(response?.data.secure_url);
      setLoadingMsg("");
      // alert(response?.data?.secure_url);
      setIsLoading(false);
    } catch (error) {
      setLoadingMsg("");
      setIsLoading(false);
      console.error(
        "Error uploading image:",
        error.response?.data || error.message
      );
      alert(
        `Failed to upload image: ${
          error.response?.data?.error?.message || "Please try again."
        }`
      );
    }
  };

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {/* {isLoading && <Loader />} */}
      {isLoading && <Loader text={loadingMsg} />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
          Start a Campaign
        </h1>
      </div>

      <div className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title || itemDetails?.title}
            handleChange={(e) => handleFormFieldChange("title", e)}
          />
        </div>

        <FormField
          labelName="Tell us your Story *"
          placeholder="Write your story"
          isTextArea
          value={form.description || itemDetails?.description}
          handleChange={(e) => handleFormFieldChange("description", e)}
        />

        <label className="flex-1  w-full flex flex-col">
          <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
            Category *
          </span>
          <div className="outline-none bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[15px] sm:min-w-[300px]">
            <Select
              placeholder="Select Category"
              className="dark"
              variant="bordered"
              size="lg"
              defaultSelectedKeys={
                itemDetails?.category_id
                  ? [itemDetails.category_id.toString()]
                  : []
              }
              popoverProps={{
                classNames: {
                  content: "dark bg-[#13131a] text-white dark:bg-content1",
                },
              }}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories?.map((category) => (
                <SelectItem
                  className="dark"
                  key={category?.id}
                  value={category.id}
                >
                  {category.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </label>

        <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
          <img
            src={money}
            alt="money"
            className="w-[40px] h-[40px] object-contain"
          />
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">
            You will get 100% of the raised amount
          </h4>
        </div>

        {/* Goal */}
        <div className="w-full">
          <p className="font-epilogue  font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
            Goal *
          </p>
          <Input
            variant="bordered"
            size="lg"
            className="w-full dark text-white"
            placeholder="Rs. 20,00,000"
            value={form.target}
            onChange={(e) => {
              // Remove any existing commas and non-digit characters
              const rawValue = e.target.value.replace(/[^\d]/g, "");
              // Add commas for Indian number format (2,00,000)
              const formattedValue = rawValue.replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              );
              handleFormFieldChange("target", {
                ...e,
                target: { ...e.target, value: formattedValue },
              });
            }}
          />
        </div>
        <label className="flex-1  w-full flex flex-col">
          <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
            Start Date *
          </span>
          <div className="outline-none bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[15px] sm:min-w-[300px]">
            <DatePicker
              minValue={today(getLocalTimeZone())}
              // defaultValue={parseDate("2024-04-04")}
              popoverProps={{
                classNames: {
                  content: "dark bg-[#13131a] text-white dark:bg-content1",
                },
              }}
              aria-label="date-picker-create-campaign"
              variant="bordered"
              size="lg"
              className="dark"
              value={startDate}
              onChange={setStartDate}
            />
          </div>
        </label>
        <label className="flex-1  w-full flex flex-col">
          <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
            End Date *
          </span>
          <div className="outline-none bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[15px] sm:min-w-[300px]">
            <DatePicker
              minValue={today(getLocalTimeZone())}
              defaultValue={today(getLocalTimeZone()).subtract({ days: 1 })}
              popoverProps={{
                classNames: {
                  content: "dark bg-[#13131a] text-white dark:bg-content1",
                },
              }}
              aria-label="date-picker-create-campaign"
              variant="bordered"
              size="lg"
              className="dark"
              value={endDate}
              onChange={setEndDate}
            />
          </div>
        </label>

        <label className="flex-1  w-full flex flex-col">
          <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
            Thumbnail Image *
          </span>
          <div className="outline-none flex bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[15px] sm:min-w-[300px]">
            <Input
              isRequired
              variant="bordered"
              type="file"
              size="lg"
              className="dark"
              onChange={handleImageUpload}
              accept="image/*"
            />
            {imageUrl && (
              <div className="">
                <img
                  src={imageUrl}
                  alt="uploaded_img"
                  className="h-[50px] mx-5 w-[50px] rounded-xl"
                />
              </div>
            )}
          </div>
        </label>
        <label className="flex-1 w-full flex flex-col">
          <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
            Campaign Images
          </span>
          <div className="outline-none flex bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[15px] sm:min-w-[300px]">
            <Input
              isRequired
              variant="bordered"
              type="file"
              size="lg"
              className="dark"
              multiple
              onChange={handleMultipleImageUpload}
              accept="image/*"
            />
          </div>
          <div className="flex gap-2 mt-3">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`uploaded_img_${index}`}
                className="h-[50px] w-[50px] rounded-xl"
              />
            ))}
          </div>
        </label>

        {/* <div className=" flex items-end justify-between">
          <div className=" flex justify-center items-center">
            
          </div>
        </div> */}
        {/* <p className="text-white">or upload from your local</p> */}

        <div className="flex justify-center items-center mt-[40px]">
          <CustomBtn
            handleClick={() => {
              if (itemDetails) {
                handleUpdateCampaign();
              } else {
                handleCreateCampaign();
              }
            }}
            title={itemDetails ? "Update Campaign" : "Submit new campaign"}
            styles="bg-[#1dc071]"
          />
        </div>
      </div>
    </div>
  );
}

export default CreateCampaign;
