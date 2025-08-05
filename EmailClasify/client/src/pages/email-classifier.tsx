import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Mail, 
  Brain, 
  Eraser, 
  Upload, 
  Clipboard,
  AlertTriangle,
  HelpCircle,
  MessageSquare,
  Handshake,
  Download,
  BarChart3,
  History,
  Layers,
  Settings,
  User,
  CheckCircle,
  Loader2
} from "lucide-react";

interface ClassificationResult {
  primaryCategory: string;
  confidenceScores: {
    complaint: number;
    query: number;
    feedback: number;
    lead: number;
  };
  analysisSummary: string[];
}

interface Stats {
  complaints: number;
  queries: number;
  feedback: number;
  leads: number;
  total: number;
}

const categoryConfig = {
  complaint: {
    icon: AlertTriangle,
    label: "COMPLAINT",
    color: "red",
    bgColor: "bg-red-50",
    borderColor: "border-l-red-500",
    textColor: "text-red-900",
    iconColor: "text-red-600",
    badgeColor: "bg-red-100 text-red-800",
    progressColor: "bg-red-600",
    progressBg: "bg-red-200",
    description: "Customer expressing dissatisfaction, issues, or problems with products/services."
  },
  query: {
    icon: HelpCircle,
    label: "QUERY",
    color: "amber",
    bgColor: "bg-amber-50",
    borderColor: "border-l-amber-500",
    textColor: "text-amber-900",
    iconColor: "text-amber-600",
    badgeColor: "bg-amber-100 text-amber-800",
    progressColor: "bg-amber-600",
    progressBg: "bg-amber-200",
    description: "Customer seeking information, support, or clarification about products/services."
  },
  feedback: {
    icon: MessageSquare,
    label: "FEEDBACK",
    color: "blue",
    bgColor: "bg-blue-50",
    borderColor: "border-l-blue-500",
    textColor: "text-blue-900",
    iconColor: "text-blue-600",
    badgeColor: "bg-blue-100 text-blue-800",
    progressColor: "bg-blue-600",
    progressBg: "bg-blue-200",
    description: "Customer providing suggestions, reviews, or constructive input about experiences."
  },
  lead: {
    icon: Handshake,
    label: "LEAD",
    color: "green",
    bgColor: "bg-green-50",
    borderColor: "border-l-green-500",
    textColor: "text-green-900",
    iconColor: "text-green-600",
    badgeColor: "bg-green-100 text-green-800",
    progressColor: "bg-green-600",
    progressBg: "bg-green-200",
    description: "Potential customer showing interest in products/services or sales opportunities."
  }
};

export default function EmailClassifier() {
  const [emailContent, setEmailContent] = useState("");
  const [classificationResult, setClassificationResult] = useState<ClassificationResult | null>(null);
  const { toast } = useToast();

  // Get statistics
  const { data: stats } = useQuery<Stats>({
    queryKey: ['/api/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Classification mutation
  const classifyMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/classify", { emailContent: content });
      return response.json();
    },
    onSuccess: (result) => {
      setClassificationResult(result);
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: "Email Classified Successfully",
        description: `Primary category: ${result.primaryCategory.toUpperCase()}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Classification Failed",
        description: error.message || "Failed to classify email. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleClassify = () => {
    if (!emailContent.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter email content to classify.",
        variant: "destructive",
      });
      return;
    }
    classifyMutation.mutate(emailContent);
  };

  const handleClear = () => {
    setEmailContent("");
    setClassificationResult(null);
  };

  const getCategoryData = (category: string) => categoryConfig[category as keyof typeof categoryConfig];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Mail className="text-white text-sm" />
                </div>
                <h1 className="text-xl font-bold text-slate-900">Email Classifier</h1>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#classify" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-4 -mb-px">
                Classify
              </a>
              <a href="#batch" className="text-slate-500 hover:text-slate-700 font-medium pb-4">
                Batch Process
              </a>
              <a href="#history" className="text-slate-500 hover:text-slate-700 font-medium pb-4">
                History
              </a>
              <a href="#analytics" className="text-slate-500 hover:text-slate-700 font-medium pb-4">
                Analytics
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Customer Email Classification</h2>
          <p className="text-slate-600 text-lg">Automatically classify incoming emails into categories using AI-powered analysis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Classification Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Email Classification</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Clipboard className="w-4 h-4 mr-2" />
                      Paste
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Input */}
                <div className="space-y-3">
                  <Label htmlFor="email-content" className="text-sm font-semibold text-slate-900">
                    Email Content
                  </Label>
                  <Textarea
                    id="email-content"
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    rows={12}
                    className="resize-none text-base leading-relaxed"
                    placeholder="Paste your email content here or upload an email file..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button 
                      onClick={handleClassify}
                      disabled={classifyMutation.isPending}
                      className="px-6 py-3 font-semibold"
                    >
                      {classifyMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Classify Email
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={handleClear}>
                      <Eraser className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                  <div className="text-sm text-slate-500">
                    Processing time: ~2-3 seconds
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Classification Results */}
            {classificationResult && (
              <Card className="mt-6 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Classification Results</CardTitle>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Export Results
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Results Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(classificationResult.confidenceScores)
                      .sort(([, a], [, b]) => b - a)
                      .map(([category, confidence], index) => {
                        const config = getCategoryData(category);
                        const Icon = config.icon;
                        const isPrimary = category === classificationResult.primaryCategory;
                        
                        return (
                          <div
                            key={category}
                            className={`${config.bgColor} ${config.borderColor} border-l-4 p-4 rounded-r-lg`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Icon className={`${config.iconColor} w-4 h-4`} />
                                <span className={`font-semibold ${config.textColor}`}>
                                  {config.label}
                                </span>
                              </div>
                              {isPrimary && (
                                <Badge className={config.badgeColor}>Primary</Badge>
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Confidence</span>
                                <span className="font-semibold">{Math.round(confidence)}%</span>
                              </div>
                              <div className={`w-full ${config.progressBg} rounded-full h-2`}>
                                <div
                                  className={`${config.progressColor} h-2 rounded-full transition-all duration-300`}
                                  style={{ width: `${confidence}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Analysis Summary */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Analysis Summary</h4>
                    <ul className="text-sm text-slate-700 space-y-1">
                      {classificationResult.analysisSummary.map((insight, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="text-green-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Category Definitions */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Category Definitions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(categoryConfig).map(([category, config]) => {
                  const Icon = config.icon;
                  return (
                    <div key={category} className={`${config.borderColor} border-l-4 pl-4`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon className={`${config.iconColor} w-4 h-4`} />
                        <h4 className={`font-semibold ${config.textColor}`}>{config.label}</h4>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {config.description}
                      </p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Today's Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats ? (
                  <>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <span className="text-sm font-medium">Complaints</span>
                      </div>
                      <span className="font-bold text-slate-900">{stats.complaints}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-amber-500 rounded-full" />
                        <span className="text-sm font-medium">Queries</span>
                      </div>
                      <span className="font-bold text-slate-900">{stats.queries}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <span className="text-sm font-medium">Feedback</span>
                      </div>
                      <span className="font-bold text-slate-900">{stats.feedback}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-sm font-medium">Leads</span>
                      </div>
                      <span className="font-bold text-slate-900">{stats.leads}</span>
                    </div>
                    
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Total Processed</span>
                      <span className="font-semibold text-slate-900">{stats.total}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-slate-500">Loading statistics...</div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center space-x-3">
                    <Layers className="w-4 h-4" />
                    <span>Batch Process</span>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center space-x-3">
                    <Download className="w-4 h-4" />
                    <span>Export Results</span>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-4 h-4" />
                    <span>View Analytics</span>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center space-x-3">
                    <History className="w-4 h-4" />
                    <span>Classification History</span>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <p className="text-sm text-slate-500">© 2024 Email Classifier. AI-Powered Business Solutions.</p>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-sm text-slate-500 hover:text-slate-700">Privacy Policy</a>
                <a href="#" className="text-sm text-slate-500 hover:text-slate-700">Terms of Service</a>
                <a href="#" className="text-sm text-slate-500 hover:text-slate-700">API Documentation</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-slate-500">API Status: Online</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
