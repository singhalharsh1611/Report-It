import React, { useContext, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Image as ImageIcon, X, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import AuthContext from "@/contexts/AuthContext";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const openCageApiKey = import.meta.env.VITE_OPENCAGE_API_KEY;
const openCageUrl = "https://api.opencagedata.com/geocode/v1/json";

const ReportIssuePage = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  const { token } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLongitude(longitude);
          setLatitude(latitude);

          try {
            const response = await axios.get(openCageUrl, {
              params: {
                q: `${latitude}+${longitude}`,
                key: openCageApiKey,
              },
            });

            const textAddress = response.data.results[0]?.formatted;

            if (textAddress) {
              setAddress(textAddress);
            } else {
              setAddress(`Lat: ${latitude}, Lng: ${longitude}`);
              toast.error("Unable to fetch address");
            }
          } catch (error) {
            toast.error(error);
          }
        },
        (error) => {
          toast.error("Unable to fetch location");
        }
      );
    } else toast.error("Geolocation is not supported by your browser");
  };

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const newImages = Array.from(event.target.files);
      setImageFiles((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (imageFiles.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }
    if(token===null){
      toast.error("plz login");
      navigate("/login");
      return;
    }
    console.log(token);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("location[address]", address);
    formData.append("location[latitude]", latitude);
    formData.append("location[longitude]", longitude);
    imageFiles.forEach((file) => formData.append("images", file));

    setIsSubmitting(true);

    try {
      await axios.post(`${backendUrl}/api/issue/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Issue reported sucessfully");
      navigate("/issues");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while reporting the issue"
      );
    } finally {
      setIsSubmitting(false);
      toast.success('Your issue has been reported successfully!');
      setTimeout(() => {
        navigate('/issues');
      }, 1500); // Only one delay argument, properly placed
    }
    

  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Report an Issue</h1>
        <p className="text-muted-foreground mt-2">
          Fill out the form below to report a civic issue in your community.
        </p>
      </div>

      <Card className="border border-white/10">
        <CardHeader>
          <CardTitle>Issue Details</CardTitle>
          <CardDescription>
            Please provide as much detail as possible to help resolve the issue
            quickly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Issue Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Issue Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Broken Streetlight, Pothole, etc."
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Issue Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roads">Roads</SelectItem>
                    <SelectItem value="street light">Street Light</SelectItem>
                    <SelectItem value="sewage">Sewage</SelectItem>
                    <SelectItem value="water">Water</SelectItem>
                    <SelectItem value="electricity">Electricity</SelectItem>
                    <SelectItem value="garbage">Garbage</SelectItem>
                    <SelectItem value="others">
                      Others (Please Specify)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/*Description*/}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please describe the issue in detail..."
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    placeholder="Enter address or coordinates"
                    className="flex-1"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={handleUserLocation}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Click the map pin to use your current location and click to
                  edit text
                </p>
              </div>

              {/* Image*/}
              <div className="space-y-2">
                <Label htmlFor="images">Upload Images</Label>
                <div className="border border-dashed border-white/20 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="images"
                    className="flex flex-col items-center justify-center cursor-pointer py-4"
                  >
                    <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                    <span className="text-sm font-medium">Click to upload</span>
                    <span className="text-xs text-muted-foreground">
                      PNG, JPG, GIF up to 10MB each
                    </span>
                  </label>
                </div>

                {/* Image Preview */}
                {imageFiles.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {imageFiles.map((img, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-md overflow-hidden border border-white/10">
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Issue"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportIssuePage;
