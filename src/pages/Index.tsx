
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    stayDate: "",
    roomNumber: "",
    exteriorRating: "",
    exteriorLikes: [] as string[],
    exteriorOther: "",
    roomInteriorRating: "",
    commonAreasRating: "",
    interiorLikes: [] as string[],
    interiorOther: "",
    overallImpression: "",
    suggestions: "",
    wouldRecommend: ""
  });

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleCheckbox = (field: string, value: string) => {
    const currentValues = formData[field as keyof typeof formData] as string[];
    
    if (currentValues.includes(value)) {
      updateFormData(field, currentValues.filter(item => item !== value));
    } else {
      updateFormData(field, [...currentValues, value]);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Спасибо за участие в опросе!",
      description: "Ваши ответы успешно отправлены.",
    });
    
    console.log(formData);
    // В реальном проекте здесь отправка данных на сервер
    
    // Сбросить форму
    setFormData({
      name: "",
      stayDate: "",
      roomNumber: "",
      exteriorRating: "",
      exteriorLikes: [],
      exteriorOther: "",
      roomInteriorRating: "",
      commonAreasRating: "",
      interiorLikes: [],
      interiorOther: "",
      overallImpression: "",
      suggestions: "",
      wouldRecommend: ""
    });
    setStep(1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return true; // Первый шаг необязательный
      case 2:
        return !!formData.exteriorRating;
      case 3:
        return !!formData.roomInteriorRating && !!formData.commonAreasRating;
      case 4:
        return !!formData.overallImpression;
      case 5:
        return !!formData.wouldRecommend;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <Card className="w-full shadow-lg border-purple-100">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-100 rounded-t-lg">
            <CardTitle className="text-2xl md:text-3xl font-playfair text-center text-gray-800">
              Опрос для гостей отеля: Влияние интерьера и экстерьера
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Ваше мнение важно для нас и поможет сделать пребывание ещё более комфортным
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xl font-semibold text-gray-800">1. Общая информация</h3>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="name">Ваше имя (необязательно):</Label>
                    <Input 
                      id="name" 
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      placeholder="Введите ваше имя" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="stayDate">Дата проживания в отеле:</Label>
                    <Input 
                      id="stayDate" 
                      type="date" 
                      value={formData.stayDate}
                      onChange={(e) => updateFormData("stayDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="roomNumber">Номер номера:</Label>
                    <Input 
                      id="roomNumber" 
                      value={formData.roomNumber}
                      onChange={(e) => updateFormData("roomNumber", e.target.value)}
                      placeholder="Например: 304" 
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xl font-semibold text-gray-800">2. Впечатление от экстерьера</h3>
                <div className="space-y-6">
                  <div>
                    <Label>
                      Как вы оцениваете внешний вид здания отеля по шкале от 1 до 5? (1 - ужасно, 5 - отлично)
                    </Label>
                    <RadioGroup 
                      value={formData.exteriorRating}
                      onValueChange={(value) => updateFormData("exteriorRating", value)}
                      className="flex justify-between mt-2"
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                          <RadioGroupItem value={rating.toString()} id={`exterior-${rating}`} />
                          <Label htmlFor={`exterior-${rating}`}>{rating}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>Что вам понравилось в экстерьере отеля? (выберите все подходящие варианты)</Label>
                    <div className="grid gap-2">
                      {[
                        { id: "facade", label: "Дизайн фасада" },
                        { id: "exterior-interior", label: "Интерьер отеля и прилежащих зон" },
                        { id: "lighting", label: "Освещение" },
                        { id: "greenery", label: "Наличие зеленых зон/декорирование" }
                      ].map((item) => (
                        <div key={item.id} className="flex items-start space-x-2">
                          <Checkbox 
                            id={item.id}
                            checked={formData.exteriorLikes.includes(item.label)}
                            onCheckedChange={() => toggleCheckbox("exteriorLikes", item.label)}
                          />
                          <Label htmlFor={item.id} className="leading-tight">{item.label}</Label>
                        </div>
                      ))}
                    </div>
                    <div>
                      <Label htmlFor="exteriorOther">Другое (пожалуйста, уточните):</Label>
                      <Input 
                        id="exteriorOther" 
                        value={formData.exteriorOther}
                        onChange={(e) => updateFormData("exteriorOther", e.target.value)}
                        placeholder="Введите ваш вариант" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xl font-semibold text-gray-800">3. Впечатление от интерьера</h3>
                <div className="space-y-6">
                  <div>
                    <Label>
                      Как вы оцениваете интерьер вашего номера по шкале от 1 до 5? (1 - ужасно, 5 - отлично)
                    </Label>
                    <RadioGroup 
                      value={formData.roomInteriorRating}
                      onValueChange={(value) => updateFormData("roomInteriorRating", value)}
                      className="flex justify-between mt-2"
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                          <RadioGroupItem value={rating.toString()} id={`room-${rating}`} />
                          <Label htmlFor={`room-${rating}`}>{rating}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>
                      Как вы оцениваете общий интерьер отеля (лобби, коридоры, общие зоны) по шкале от 1 до 5?
                    </Label>
                    <RadioGroup 
                      value={formData.commonAreasRating}
                      onValueChange={(value) => updateFormData("commonAreasRating", value)}
                      className="flex justify-between mt-2"
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                          <RadioGroupItem value={rating.toString()} id={`common-${rating}`} />
                          <Label htmlFor={`common-${rating}`}>{rating}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>Что вам понравилось в интерьере отеля? (выберите все подходящие варианты)</Label>
                    <div className="grid gap-2">
                      {[
                        { id: "colors", label: "Цветовая гамма" },
                        { id: "furniture", label: "Оборудование и мебель" },
                        { id: "interior-lighting", label: "Освещение" },
                        { id: "decor", label: "Декор и детали" },
                        { id: "comfort", label: "Удобство" }
                      ].map((item) => (
                        <div key={item.id} className="flex items-start space-x-2">
                          <Checkbox 
                            id={item.id}
                            checked={formData.interiorLikes.includes(item.label)}
                            onCheckedChange={() => toggleCheckbox("interiorLikes", item.label)}
                          />
                          <Label htmlFor={item.id} className="leading-tight">{item.label}</Label>
                        </div>
                      ))}
                    </div>
                    <div>
                      <Label htmlFor="interiorOther">Другое (пожалуйста, уточните):</Label>
                      <Input 
                        id="interiorOther" 
                        value={formData.interiorOther}
                        onChange={(e) => updateFormData("interiorOther", e.target.value)}
                        placeholder="Введите ваш вариант" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xl font-semibold text-gray-800">4. Влияние на общее впечатление</h3>
                <div className="space-y-6">
                  <div>
                    <Label>
                      Как интерьер и экстерьер отеля повлияли на ваше общее впечатление о вашем пребывании? (выберите одно)
                    </Label>
                    <RadioGroup 
                      value={formData.overallImpression}
                      onValueChange={(value) => updateFormData("overallImpression", value)}
                      className="space-y-2 mt-2"
                    >
                      {[
                        "Очень положительно",
                        "В основном положительно",
                        "Нейтрально",
                        "В основном отрицательно",
                        "Очень отрицательно"
                      ].map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`impression-${index}`} />
                          <Label htmlFor={`impression-${index}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="suggestions">
                      Пожалуйста, поделитесь своими комментариями или предложениями по улучшению интерьера и экстерьера:
                    </Label>
                    <Textarea 
                      id="suggestions"
                      value={formData.suggestions}
                      onChange={(e) => updateFormData("suggestions", e.target.value)}
                      placeholder="Ваши комментарии или предложения..."
                      className="min-h-[100px] mt-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xl font-semibold text-gray-800">5. Заключение</h3>
                <div>
                  <Label>
                    Вы бы рекомендовали наш отель друзьям и знакомым на основе впечатления от интерьера и экстерьера?
                  </Label>
                  <RadioGroup 
                    value={formData.wouldRecommend}
                    onValueChange={(value) => updateFormData("wouldRecommend", value)}
                    className="space-y-2 mt-2"
                  >
                    {["Да", "Нет", "Возможно"].map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`recommend-${index}`} />
                        <Label htmlFor={`recommend-${index}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="p-4 mt-6 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-center font-medium text-blue-800">
                    Спасибо за участие в опросе! Ваши ответы помогут нам улучшить качество обслуживания.
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t p-6">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
            >
              Назад
            </Button>

            {step < 5 ? (
              <Button 
                onClick={() => setStep(step + 1)}
                disabled={!isStepValid()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Далее
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Отправить
              </Button>
            )}
          </CardFooter>
        </Card>
        
        <div className="w-full mt-4 flex justify-center">
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${
                  step === i ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
