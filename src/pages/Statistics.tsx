
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type SurveyData = {
  id: number;
  submittedAt: string;
  name: string;
  stayDate: string;
  roomNumber: string;
  exteriorRating: string;
  exteriorLikes: string[];
  exteriorOther: string;
  roomInteriorRating: string;
  commonAreasRating: string;
  interiorLikes: string[];
  interiorOther: string;
  overallImpression: string;
  suggestions: string;
  wouldRecommend: string;
};

const Statistics = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<SurveyData[]>([]);
  const [activeTab, setActiveTab] = useState("ratings");

  useEffect(() => {
    // Загружаем данные из localStorage
    const storedSurveys = localStorage.getItem("surveys");
    if (storedSurveys) {
      setSurveys(JSON.parse(storedSurveys));
    }
  }, []);

  // Подсчет средних значений рейтингов
  const calculateAverage = (field: keyof SurveyData) => {
    if (surveys.length === 0) return 0;
    
    const sum = surveys.reduce((acc, survey) => {
      return acc + parseInt(survey[field] as string || "0", 10);
    }, 0);
    
    return (sum / surveys.length).toFixed(1);
  };

  // Подсчет процентов для рекомендаций
  const getRecommendationStats = () => {
    if (surveys.length === 0) return { yes: 0, no: 0, maybe: 0 };
    
    const yes = surveys.filter(s => s.wouldRecommend === "Да").length;
    const no = surveys.filter(s => s.wouldRecommend === "Нет").length;
    const maybe = surveys.filter(s => s.wouldRecommend === "Возможно").length;
    
    return {
      yes: Math.round((yes / surveys.length) * 100),
      no: Math.round((no / surveys.length) * 100),
      maybe: Math.round((maybe / surveys.length) * 100)
    };
  };

  // Подсчет популярности особенностей
  const getFeaturesStats = (field: "exteriorLikes" | "interiorLikes") => {
    if (surveys.length === 0) return {};
    
    const features: Record<string, number> = {};
    
    surveys.forEach(survey => {
      survey[field].forEach(feature => {
        features[feature] = (features[feature] || 0) + 1;
      });
    });
    
    return Object.entries(features)
      .sort((a, b) => b[1] - a[1])
      .reduce((obj, [key, value]) => {
        return {
          ...obj,
          [key]: Math.round((value / surveys.length) * 100)
        };
      }, {});
  };

  const recommendStats = getRecommendationStats();
  const exteriorFeatures = getFeaturesStats("exteriorLikes");
  const interiorFeatures = getFeaturesStats("interiorLikes");

  // Группировка впечатлений
  const getImpressionStats = () => {
    if (surveys.length === 0) return {};
    
    const impressions: Record<string, number> = {};
    
    surveys.forEach(survey => {
      const impression = survey.overallImpression;
      if (impression) {
        impressions[impression] = (impressions[impression] || 0) + 1;
      }
    });
    
    return Object.entries(impressions)
      .sort((a, b) => b[1] - a[1])
      .reduce((obj, [key, value]) => {
        return {
          ...obj,
          [key]: Math.round((value / surveys.length) * 100)
        };
      }, {});
  };

  const impressionStats = getImpressionStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Card className="shadow-lg border-purple-100">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-100 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl md:text-3xl font-playfair text-gray-800">
                  Статистика опроса
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Визуализация результатов опроса гостей отеля
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate("/")} 
                className="flex items-center gap-2"
              >
                <Icon name="FileText" size={16} />
                К анкете
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-100 rounded-lg flex items-center gap-3">
              <Icon name="Info" className="text-yellow-600" />
              <p className="text-sm text-yellow-800">
                {surveys.length > 0 
                  ? `Всего получено ответов: ${surveys.length}`
                  : "Пока нет данных. Заполните анкету, чтобы увидеть статистику."}
              </p>
            </div>

            {surveys.length > 0 && (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-3 mb-6">
                  <TabsTrigger value="ratings">Рейтинги</TabsTrigger>
                  <TabsTrigger value="features">Особенности</TabsTrigger>
                  <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
                </TabsList>

                <TabsContent value="ratings" className="animate-fade-in">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Экстерьер</CardTitle>
                        <CardDescription>
                          Средний рейтинг внешнего вида
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end gap-2">
                          <div className="text-4xl font-bold text-purple-700">
                            {calculateAverage("exteriorRating")}
                          </div>
                          <div className="text-sm text-gray-500">/ 5</div>
                        </div>
                        <Progress 
                          value={parseFloat(calculateAverage("exteriorRating")) * 20} 
                          className="h-2 mt-2" 
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Интерьер номера</CardTitle>
                        <CardDescription>
                          Средний рейтинг номеров
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end gap-2">
                          <div className="text-4xl font-bold text-purple-700">
                            {calculateAverage("roomInteriorRating")}
                          </div>
                          <div className="text-sm text-gray-500">/ 5</div>
                        </div>
                        <Progress 
                          value={parseFloat(calculateAverage("roomInteriorRating")) * 20} 
                          className="h-2 mt-2" 
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Общие зоны</CardTitle>
                        <CardDescription>
                          Средний рейтинг общих зон
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end gap-2">
                          <div className="text-4xl font-bold text-purple-700">
                            {calculateAverage("commonAreasRating")}
                          </div>
                          <div className="text-sm text-gray-500">/ 5</div>
                        </div>
                        <Progress 
                          value={parseFloat(calculateAverage("commonAreasRating")) * 20} 
                          className="h-2 mt-2" 
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Общее впечатление</CardTitle>
                        <CardDescription>
                          Как интерьер/экстерьер влияет на впечатление
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Object.entries(impressionStats).map(([impression, percentage]) => (
                            <div key={impression} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{impression}</span>
                                <span>{percentage}%</span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="features" className="animate-fade-in">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Популярные особенности экстерьера</CardTitle>
                        <CardDescription>
                          Что больше всего нравится гостям во внешнем виде
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Object.entries(exteriorFeatures).map(([feature, percentage]) => (
                            <div key={feature} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{feature}</span>
                                <span>{percentage}%</span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>
                          ))}
                          
                          {Object.keys(exteriorFeatures).length === 0 && (
                            <div className="text-center text-gray-500 py-4">
                              Пока нет данных
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Популярные особенности интерьера</CardTitle>
                        <CardDescription>
                          Что больше всего нравится гостям внутри
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Object.entries(interiorFeatures).map(([feature, percentage]) => (
                            <div key={feature} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{feature}</span>
                                <span>{percentage}%</span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>
                          ))}
                          
                          {Object.keys(interiorFeatures).length === 0 && (
                            <div className="text-center text-gray-500 py-4">
                              Пока нет данных
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="recommendations" className="animate-fade-in">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Рекомендации</CardTitle>
                      <CardDescription>
                        Готовность гостей рекомендовать отель на основе впечатления от интерьера и экстерьера
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-2">
                              <Badge className="bg-green-500">Да</Badge>
                              <span>Рекомендуют</span>
                            </span>
                            <span>{recommendStats.yes}%</span>
                          </div>
                          <Progress value={recommendStats.yes} className="h-2 bg-gray-200" />
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-2">
                              <Badge className="bg-yellow-500">Возможно</Badge>
                              <span>Не уверены</span>
                            </span>
                            <span>{recommendStats.maybe}%</span>
                          </div>
                          <Progress value={recommendStats.maybe} className="h-2 bg-gray-200" />
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-2">
                              <Badge className="bg-red-500">Нет</Badge>
                              <span>Не рекомендуют</span>
                            </span>
                            <span>{recommendStats.no}%</span>
                          </div>
                          <Progress value={recommendStats.no} className="h-2 bg-gray-200" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {surveys.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Последние комментарии</h3>
                      <div className="space-y-4">
                        {surveys.slice(-3).reverse().map((survey) => (
                          survey.suggestions && (
                            <Card key={survey.id}>
                              <CardContent className="pt-6">
                                <div className="italic text-gray-600">{survey.suggestions}</div>
                                <div className="flex justify-between items-center mt-3 pt-3 border-t text-sm text-gray-500">
                                  <div>{survey.name || "Гость"}</div>
                                  <div>
                                    {new Date(survey.submittedAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        ))}

                        {surveys.filter(s => s.suggestions).length === 0 && (
                          <div className="text-center text-gray-500 py-4">
                            Пока нет комментариев
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>

          <CardFooter className="flex justify-center border-t p-6">
            <Button 
              onClick={() => navigate("/")} 
              className="bg-purple-600 hover:bg-purple-700"
            >
              Заполнить анкету
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;
