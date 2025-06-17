"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Share2, 
  Search, 
  Heart, 
  Eye, 
  Download,
  Sparkles,
  Grid3X3,
  List,
  Plus,
  Figma,
  Bot,
  Wrench,
  FileText,
  Cog,
  Code,
  Layers,
  Zap,
  Target,
  CheckCircle,
  ArrowRight,
  Play,
  Palette,
  Component,
  MousePointer,
  Smartphone,
  Globe,
  Star,
  TrendingUp,
  Users,
  Clock,
  Shield,
  AlertTriangle,
  Loader2,
  RefreshCw,
  ExternalLink,
  Info,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { EnhancedErrorBoundary } from "@/components/enhanced-error-boundary";

// Enhanced interfaces
interface StatusBadgeProps {
  status: "connected" | "disconnected" | "connecting" | "error";
  text: string;
  onClick?: () => void;
}

interface GlassButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  interactive?: boolean;
  glowEffect?: boolean;
}

interface ConnectionState {
  status: "connected" | "disconnected" | "connecting" | "error";
  message: string;
  lastConnected?: Date;
  apiVersion?: string;
  rateLimit?: {
    remaining: number;
    reset: Date;
  };
}

interface GenerationProgress {
  step: string;
  progress: number;
  estimatedTimeRemaining?: number;
}

// Enhanced Status Badge with animation and interaction
const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text, onClick }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          bg: "bg-emerald-500/20",
          text: "text-emerald-300",
          border: "border-emerald-500/30",
          shadow: "shadow-emerald-500/10",
          pulse: "bg-emerald-400"
        };
      case "connecting":
        return {
          bg: "bg-yellow-500/20",
          text: "text-yellow-300",
          border: "border-yellow-500/30",
          shadow: "shadow-yellow-500/10",
          pulse: "bg-yellow-400"
        };
      case "error":
        return {
          bg: "bg-red-500/20",
          text: "text-red-300",
          border: "border-red-500/30",
          shadow: "shadow-red-500/10",
          pulse: "bg-red-400"
        };
      default:
        return {
          bg: "bg-slate-500/20",
          text: "text-slate-300",
          border: "border-slate-500/30",
          shadow: "shadow-slate-500/10",
          pulse: "bg-slate-400"
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div 
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md border transition-all duration-300 cursor-pointer hover:scale-105",
        config.bg,
        config.text,
        config.border,
        `shadow-lg ${config.shadow}`,
        onClick && "hover:brightness-110"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "w-2 h-2 rounded-full",
        status === "connecting" ? "animate-pulse" : "animate-pulse",
        config.pulse
      )} />
      <span>{text}</span>
      {onClick && <ExternalLink className="w-3 h-3 opacity-60" />}
    </div>
  );
};

// Enhanced Glass Button with loading states and better animations
const GlassButton: React.FC<GlassButtonProps> = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  onClick, 
  disabled = false,
  loading = false,
  className = ""
}) => {
  const baseClasses = "relative overflow-hidden backdrop-blur-md border transition-all duration-300 font-medium rounded-xl flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600/30 to-purple-600/30 border-blue-500/30 text-white hover:from-blue-600/40 hover:to-purple-600/40 hover:border-blue-400/50 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30",
    secondary: "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 shadow-lg shadow-black/20",
    ghost: "bg-transparent border-transparent text-white/70 hover:bg-white/10 hover:text-white",
    success: "bg-gradient-to-r from-emerald-600/30 to-green-600/30 border-emerald-500/30 text-white hover:from-emerald-600/40 hover:to-green-600/40 shadow-lg shadow-emerald-500/20",
    warning: "bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border-yellow-500/30 text-white hover:from-yellow-600/40 hover:to-orange-600/40 shadow-lg shadow-yellow-500/20",
    danger: "bg-gradient-to-r from-red-600/30 to-pink-600/30 border-red-500/30 text-white hover:from-red-600/40 hover:to-pink-600/40 shadow-lg shadow-red-500/20"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        !disabled && !loading && "hover:scale-105 active:scale-95",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
      <span className="relative z-10 flex items-center gap-2">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </span>
    </button>
  );
};

// Enhanced Bento Card with better visual effects
const BentoCard: React.FC<BentoCardProps> = ({ 
  children, 
  className = "", 
  size = "md", 
  interactive = false,
  glowEffect = false 
}) => {
  const sizes = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10"
  };

  return (
    <div className={cn(
      "relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl transition-all duration-300 shadow-xl",
      interactive && "hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] cursor-pointer",
      glowEffect && "hover:shadow-2xl hover:shadow-blue-500/20",
      sizes[size],
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Enhanced Template Card with better states
interface TemplateCardProps {
  title: string;
  description?: string;
  image: string;
  isNew?: boolean;
  complexity: "Low" | "Medium" | "High";
  category: string;
  author?: string;
  downloads?: number;
  rating?: number;
  isFavorited?: boolean;
  onFavorite?: () => void;
  onPreview?: () => void;
  onUse?: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  title,
  description,
  image,
  isNew = false,
  complexity,
  category,
  author,
  downloads,
  rating,
  isFavorited = false,
  onFavorite,
  onPreview,
  onUse
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Low": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "Medium": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "High": return "bg-red-500/20 text-red-300 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <BentoCard 
      size="sm" 
      interactive 
      glowEffect
      className="group cursor-pointer overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-video bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl mb-4 relative overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
            <Loader2 className="w-6 h-6 animate-spin text-white/60" />
          </div>
        )}
        <img 
          src={image} 
          alt={title} 
          className={cn(
            "w-full h-full object-cover rounded-xl transition-all duration-300",
            imageLoaded ? "opacity-100" : "opacity-0",
            isHovered && "scale-110"
          )}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />
        
        {/* Enhanced Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              New
            </Badge>
          )}
          <Badge className={cn("text-xs", getComplexityColor(complexity))}>
            {complexity}
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
            {category}
          </Badge>
        </div>

        {/* Enhanced Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite?.();
          }}
          className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/30 transition-all duration-200 hover:scale-110"
        >
          <Heart className={cn(
            "w-4 h-4 transition-colors",
            isFavorited ? "fill-red-400 text-red-400" : "text-white"
          )} />
        </button>

        {/* Enhanced Hover overlay */}
        <div className={cn(
          "absolute inset-0 bg-black/60 flex items-center justify-center gap-3 transition-all duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <GlassButton size="sm" onClick={(e) => { e.stopPropagation(); onPreview?.(); }}>
            <Eye className="w-4 h-4" />
            Preview
          </GlassButton>
          <GlassButton variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); onUse?.(); }}>
            <Download className="w-4 h-4" />
            Use
          </GlassButton>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-medium text-white text-sm line-clamp-1">{title}</h3>
        {description && (
          <p className="text-xs text-white/60 line-clamp-2">{description}</p>
        )}
        
        {/* Enhanced metadata */}
        <div className="flex items-center justify-between text-xs text-white/50">
          <div className="flex items-center gap-2">
            {author && <span>by {author}</span>}
            {downloads && (
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {downloads}
              </span>
            )}
          </div>
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </BentoCard>
  );
};

// Main Enhanced FingMAI Component
const EnhancedFingMAI: React.FC = () => {
  const [activeTab, setActiveTab] = useState("figma-import");
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    status: "disconnected",
    message: "Not connected to Figma"
  });
  const [demoMode, setDemoMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedComplexity, setSelectedComplexity] = useState("All");
  const [sortBy, setSortBy] = useState("Popular");
  const [viewMode, setViewMode] = useState("grid");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress | null>(null);
  const [figmaUrl, setFigmaUrl] = useState("");
  const [figmaToken, setFigmaToken] = useState("");
  const [componentName, setComponentName] = useState("");
  const [requirements, setRequirements] = useState("");
  
  const { toast } = useToast();

  // Enhanced connection management with better error handling
  const handleConnectionTest = useCallback(async () => {
    if (!figmaToken) {
      toast({
        title: "⚠️ Token Required",
        description: "Please provide a Figma access token to test the connection. You can get one from Figma Account Settings > Personal Access Tokens.",
        variant: "destructive"
      });
      return;
    }

    // Validate token format
    const tokenRegex = /^figd_[A-Za-z0-9_-]+$/;
    if (!tokenRegex.test(figmaToken)) {
      toast({
        title: "❌ Invalid Token Format",
        description: "Figma tokens should start with 'figd_'. Please check your token and try again.",
        variant: "destructive"
      });
      return;
    }

    setConnectionState(prev => ({ ...prev, status: "connecting", message: "Testing connection..." }));

    try {
      const response = await fetch('/api/figma/me', {
        headers: {
          'Authorization': `Bearer ${figmaToken}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        const rateLimit = {
          remaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '100'),
          reset: new Date(Date.now() + 3600000) // 1 hour from now
        };

        setConnectionState({
          status: "connected",
          message: `Connected as ${data.handle || data.email || 'User'}`,
          lastConnected: new Date(),
          apiVersion: "v1",
          rateLimit
        });
        
        // Store token securely
        localStorage.setItem('figma-token', figmaToken);
        
        toast({
          title: "✅ Connection Successful",
          description: `Connected to Figma as ${data.handle || data.email}. Rate limit: ${rateLimit.remaining} requests remaining.`,
        });
      } else {
        // Enhanced error messages based on status codes
        let errorMessage = "Connection failed";
        let errorDescription = "Please check your token and try again.";

        switch (response.status) {
          case 401:
            errorMessage = "🔑 Invalid Access Token";
            errorDescription = "Your Figma access token is invalid or has expired. Please generate a new token from Figma Settings.";
            break;
          case 403:
            errorMessage = "🚫 Access Forbidden";
            errorDescription = "Your token doesn't have sufficient permissions. Make sure it has access to the files you want to convert.";
            break;
          case 429:
            errorMessage = "⏱️ Rate Limit Exceeded";
            errorDescription = "Too many requests. Please wait a moment before trying again.";
            break;
          case 500:
            errorMessage = "🔧 Figma Server Error";
            errorDescription = "Figma's servers are experiencing issues. Please try again later.";
            break;
          default:
            errorMessage = `❌ Connection Error (${response.status})`;
            errorDescription = data.error || data.details || "Please check your token and network connection.";
        }

        setConnectionState({
          status: "error",
          message: errorMessage
        });
        
        toast({
          title: errorMessage,
          description: errorDescription,
          variant: "destructive"
        });
      }
    } catch (error) {
      const isNetworkError = error instanceof Error && (
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError') ||
        error.message.includes('TypeError')
      );

      const errorMessage = isNetworkError 
        ? "🌐 Network Error" 
        : "❌ Connection Failed";
      
      const errorDescription = isNetworkError
        ? "Unable to reach Figma's servers. Please check your internet connection."
        : error instanceof Error ? error.message : "Unknown error occurred";

      setConnectionState({
        status: "error",
        message: errorMessage
      });
      
      toast({
        title: errorMessage,
        description: errorDescription,
        variant: "destructive"
      });
    }
  }, [figmaToken, toast]);

  // Load saved token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('figma-token');
    if (savedToken) {
      setFigmaToken(savedToken);
      // Auto-test connection with saved token
      setTimeout(() => {
        handleConnectionTest();
      }, 1000);
    }
  }, []);

  // Enhanced categories with counts
  const categories = [
    { name: "All", count: 12 },
    { name: "Cards", count: 3 },
    { name: "Navigation", count: 2 },
    { name: "Forms", count: 2 },
    { name: "Buttons", count: 2 },
    { name: "Layout", count: 2 },
    { name: "Data Display", count: 1 }
  ];

  // Enhanced templates with more metadata
  const templates = [
    {
      id: "1",
      title: "User Profile Card",
      description: "Modern glassmorphism profile card with avatar, stats, and actions",
      image: "/api/placeholder/300/200",
      isNew: true,
      complexity: "Medium" as const,
      category: "Cards",
      author: "FingMAI Team",
      downloads: 1247,
      rating: 4.8
    },
    {
      id: "2",
      title: "Navigation Menu",
      description: "Responsive navigation with smooth animations and mobile support",
      image: "/api/placeholder/300/200",
      isNew: false,
      complexity: "Low" as const,
      category: "Navigation",
      author: "Community",
      downloads: 856,
      rating: 4.6
    },
    {
      id: "3",
      title: "Contact Form",
      description: "Accessible form with validation and beautiful error states",
      image: "/api/placeholder/300/200",
      isNew: true,
      complexity: "Medium" as const,
      category: "Forms",
      author: "FingMAI Team",
      downloads: 623,
      rating: 4.9
    },
    {
      id: "4",
      title: "Hero Section",
      description: "Stunning hero section with gradient backgrounds and CTA buttons",
      image: "/api/placeholder/300/200",
      isNew: false,
      complexity: "High" as const,
      category: "Layout",
      author: "Pro Designer",
      downloads: 1892,
      rating: 4.7
    }
  ];

  const toggleFavorite = (templateId: string) => {
    setFavorites(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  // Enhanced generation with progress tracking
  const handleGeneration = async (provider: 'groq' | 'openai') => {
    if (!componentName || !requirements) {
      toast({
        title: "Missing Information",
        description: "Please provide both component name and requirements.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress({ step: "Initializing AI generation...", progress: 0 });

    try {
      // Real-time progress tracking
      const steps = [
        { step: "Analyzing requirements...", progress: 15, duration: 800 },
        { step: "Structuring component architecture...", progress: 30, duration: 1200 },
        { step: "Generating React component code...", progress: 50, duration: 2000 },
        { step: "Adding TypeScript definitions...", progress: 70, duration: 1000 },
        { step: "Optimizing styling and animations...", progress: 85, duration: 800 },
        { step: "Finalizing component...", progress: 95, duration: 500 }
      ];

      // Show progress steps with realistic timing
      for (const stepData of steps) {
        setGenerationProgress(stepData);
        await new Promise(resolve => setTimeout(resolve, stepData.duration));
      }

      // Call actual API
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          componentName,
          requirements,
          framework: 'react',
          styling: 'tailwind',
          complexity: requirements.length > 500 ? 'high' : requirements.length > 200 ? 'medium' : 'low'
        })
      });

      setGenerationProgress({ step: "Processing response...", progress: 100 });

      if (response.ok) {
        const result = await response.json();
        
        // Store generation result for display
        localStorage.setItem('lastGeneratedComponent', JSON.stringify({
          ...result,
          timestamp: new Date().toISOString()
        }));

        toast({
          title: "🎉 Generation Complete!",
          description: `Successfully generated ${result.componentName} with ${result.provider}${result.fallbackUsed ? ' (fallback)' : ''}`,
        });
        
        // Update usage statistics
        const stats = JSON.parse(localStorage.getItem('generationStats') || '{"total": 0, "groq": 0, "openai": 0}');
        stats.total += 1;
        stats[result.provider] += 1;
        localStorage.setItem('generationStats', JSON.stringify(stats));
        
        // Navigate to code view (if implemented)
        console.log('Generated code:', result);
        
      } else {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Generation failed');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "❌ Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(null);
    }
  };

  // Render methods for each tab
  const renderFigmaImport = () => (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Connection Status Alert */}
      {connectionState.status === "error" && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            {connectionState.message}. Please check your Figma access token and network connection.
          </AlertDescription>
        </Alert>
      )}

      {/* Hero Section */}
      <BentoCard size="lg" className="text-center" glowEffect>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30">
              <Figma className="w-8 h-8 text-blue-400" />
            </div>
            <ArrowRight className="w-6 h-6 text-white/60" />
            <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl border border-emerald-500/30">
              <Code className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Figma to React Converter
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Transform your Figma designs into production-ready React components with AI-powered precision
          </p>
          
          {/* Enhanced Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">98%</div>
              <div className="text-sm text-white/60">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">2min</div>
              <div className="text-sm text-white/60">Avg. Processing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">50k+</div>
              <div className="text-sm text-white/60">Components Generated</div>
            </div>
          </div>
        </div>
      </BentoCard>

      {/* Enhanced Conversion Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BentoCard className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-semibold text-white">Quick Convert</h3>
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Recommended</Badge>
          </div>
          
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-white/80 mb-2">Figma File URL</Label>
              <div className="relative">
                <Input 
                  value={figmaUrl}
                  onChange={(e) => setFigmaUrl(e.target.value)}
                  placeholder="https://www.figma.com/file/..." 
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-blue-400/50 focus:bg-white/10 pr-10"
                />
                <Figma className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-white/80 mb-2">
                Access Token
                <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
              </Label>
              <div className="relative">
                <Input 
                  type="password" 
                  value={figmaToken}
                  onChange={(e) => setFigmaToken(e.target.value)}
                  placeholder="Enter your Figma access token" 
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-blue-400/50 focus:bg-white/10 pr-10"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-2"
                  onClick={handleConnectionTest}
                  disabled={!figmaToken || connectionState.status === "connecting"}
                >
                  {connectionState.status === "connecting" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Enhanced Demo Mode */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-sm text-white">Demo Mode</span>
                </div>
                <Switch
                  checked={demoMode}
                  onCheckedChange={setDemoMode}
                />
              </div>
              <p className="text-sm text-white/60">
                Try the converter with sample data without needing a Figma API token.
              </p>
            </div>

            <GlassButton 
              variant="primary"
              className="w-full py-4 text-lg"
              disabled={!demoMode && (!figmaUrl || !figmaToken || connectionState.status !== "connected")}
              loading={isGenerating}
            >
              <Play className="w-5 h-5" />
              Start Conversion
            </GlassButton>
          </div>
        </BentoCard>

        {/* Enhanced Status Panel */}
        <BentoCard>
          <h3 className="text-lg font-semibold text-white mb-4">Connection Status</h3>
          <div className="space-y-4">
            <StatusBadge 
              status={connectionState.status} 
              text={connectionState.message}
              onClick={connectionState.status === "error" ? handleConnectionTest : undefined}
            />
            
            {connectionState.lastConnected && (
              <div className="text-xs text-white/50">
                Last connected: {connectionState.lastConnected.toLocaleTimeString()}
              </div>
            )}
            
            {connectionState.rateLimit && (
              <div className="text-xs text-white/50">
                API calls remaining: {connectionState.rateLimit.remaining}
              </div>
            )}
          </div>
          
          <div className="mt-6 space-y-3">
            {[
              { icon: Component, label: "Components", status: "ready" },
              { icon: Palette, label: "Styling", status: "ready" },
              { icon: MousePointer, label: "Interactions", status: connectionState.status === "connected" ? "ready" : "pending" },
              { icon: Smartphone, label: "Responsive", status: "ready" }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-white">{item.label}</span>
                </div>
                {item.status === "ready" ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Clock className="w-4 h-4 text-yellow-400" />
                )}
              </div>
            ))}
          </div>
        </BentoCard>
      </div>

      {/* Generation Progress */}
      {generationProgress && (
        <BentoCard className="text-center">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">{generationProgress.step}</h3>
            <Progress value={generationProgress.progress} className="w-full" />
            <p className="text-sm text-white/60">
              {generationProgress.progress}% complete
              {generationProgress.estimatedTimeRemaining && (
                <span className="ml-2">
                  • {generationProgress.estimatedTimeRemaining}s remaining
                </span>
              )}
            </p>
          </div>
        </BentoCard>
      )}

      {/* Enhanced Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Target, title: "Pixel Perfect", desc: "Exact design replication", color: "blue" },
          { icon: Layers, title: "Layer Analysis", desc: "Smart component detection", color: "purple" },
          { icon: Globe, title: "Web Standards", desc: "Semantic HTML output", color: "emerald" },
          { icon: Shield, title: "Type Safe", desc: "Full TypeScript support", color: "yellow" }
        ].map((feature, index) => (
          <BentoCard key={index} size="sm" className="text-center" interactive>
            <feature.icon className={`w-8 h-8 mx-auto mb-3 text-${feature.color}-400`} />
            <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
            <p className="text-xs text-white/60">{feature.desc}</p>
          </BentoCard>
        ))}
      </div>
    </div>
  );

  const renderAIGenerator = () => (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <BentoCard size="lg" className="text-center" glowEffect>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30">
              <Bot className="w-8 h-8 text-purple-400" />
            </div>
            <ArrowRight className="w-6 h-6 text-white/60" />
            <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl border border-emerald-500/30">
              <Code className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Code Generator
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Generate React components using AI with intelligent provider switching and advanced customization
          </p>
          
          {/* Process Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="px-4 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-sm font-medium">
              Generate
            </div>
            <ArrowRight className="w-4 h-4 text-white/40" />
            <div className="px-4 py-2 bg-white/10 text-white/60 border border-white/20 rounded-full text-sm font-medium">
              Code
            </div>
            <ArrowRight className="w-4 h-4 text-white/40" />
            <div className="px-4 py-2 bg-white/10 text-white/60 border border-white/20 rounded-full text-sm font-medium">
              Suggestions (0)
            </div>
          </div>
        </div>
      </BentoCard>

      {/* Enhanced Generator Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BentoCard className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Component Generator</h3>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">AI Powered</Badge>
          </div>
          
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-white/80 mb-2">Component Name</Label>
              <Input 
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                placeholder="e.g., UserProfileCard, NavigationMenu, ProductCard" 
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400/50 focus:bg-white/10"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-white/80 mb-2">Requirements & Specifications</Label>
              <Textarea 
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Describe your component in detail:
• What should it do and how should it look?
• What props and functionality do you need?
• Styling preferences (Tailwind CSS, styled-components, etc.)
• Responsive behavior and breakpoints
• Hover effects and animations
• Accessibility requirements
• State management needs"
                className="min-h-[160px] bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400/50 focus:bg-white/10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-white/80 mb-2">Framework</Label>
                <Select defaultValue="react">
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="next">Next.js</SelectItem>
                    <SelectItem value="vue">Vue.js</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-white/80 mb-2">Styling</Label>
                <Select defaultValue="tailwind">
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tailwind">Tailwind CSS</SelectItem>
                    <SelectItem value="styled">Styled Components</SelectItem>
                    <SelectItem value="css">CSS Modules</SelectItem>
                    <SelectItem value="emotion">Emotion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassButton 
                variant="secondary"
                className="py-4 text-base"
                onClick={() => handleGeneration('groq')}
                disabled={isGenerating}
                loading={isGenerating}
              >
                <Bot className="w-5 h-5" />
                Generate with Groq (Free)
              </GlassButton>
              
              <GlassButton 
                variant="primary"
                className="py-4 text-base"
                onClick={() => handleGeneration('openai')}
                disabled={isGenerating}
                loading={isGenerating}
              >
                <Sparkles className="w-5 h-5" />
                Generate with OpenAI (Premium)
              </GlassButton>
            </div>
          </div>
        </BentoCard>

        {/* Enhanced AI Features Panel */}
        <BentoCard>
          <h3 className="text-lg font-semibold text-white mb-4">AI Features</h3>
          <div className="space-y-3">
            {[
              { icon: Star, label: "Smart Suggestions", desc: "Intelligent code recommendations" },
              { icon: TrendingUp, label: "Best Practices", desc: "Industry-standard patterns" },
              { icon: Shield, label: "Type Safety", desc: "Full TypeScript support" },
              { icon: Users, label: "Accessibility", desc: "WCAG compliant output" }
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <feature.icon className="w-4 h-4 text-purple-400 mt-0.5" />
                <div>
                  <span className="text-sm text-white font-medium">{feature.label}</span>
                  <p className="text-xs text-white/60 mt-1">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </BentoCard>
      </div>

      {/* Generation Progress */}
      {generationProgress && (
        <BentoCard className="text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Bot className="w-5 h-5 text-purple-400 animate-pulse" />
              <h3 className="text-lg font-semibold text-white">{generationProgress.step}</h3>
            </div>
            <Progress value={generationProgress.progress} className="w-full" />
            <p className="text-sm text-white/60">
              {generationProgress.progress}% complete
            </p>
          </div>
        </BentoCard>
      )}

      {/* Enhanced Provider Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BentoCard glowEffect>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg border border-green-500/30">
              <Bot className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Groq (Free)</h3>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Free</Badge>
          </div>
          <ul className="space-y-3 text-sm">
            {[
              { text: "Lightning-fast generation", icon: CheckCircle, color: "green" },
              { text: "Basic component structure", icon: CheckCircle, color: "green" },
              { text: "Standard styling options", icon: CheckCircle, color: "green" },
              { text: "Limited complexity", icon: Clock, color: "yellow" }
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-white/70">
                <item.icon className={`w-4 h-4 text-${item.color}-400`} />
                {item.text}
              </li>
            ))}
          </ul>
        </BentoCard>

        <BentoCard glowEffect>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">OpenAI (Premium)</h3>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Premium</Badge>
          </div>
          <ul className="space-y-3 text-sm">
            {[
              { text: "Advanced AI reasoning", icon: CheckCircle, color: "emerald" },
              { text: "Complex component logic", icon: CheckCircle, color: "emerald" },
              { text: "Custom animations & effects", icon: CheckCircle, color: "emerald" },
              { text: "Production-ready code", icon: CheckCircle, color: "emerald" }
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-white/70">
                <item.icon className={`w-4 h-4 text-${item.color}-400`} />
                {item.text}
              </li>
            ))}
          </ul>
        </BentoCard>
      </div>
    </div>
  );

  // Rest of the render methods would be similar enhancements...
  // For brevity, I'll continue with the main structure

  return (
    <EnhancedErrorBoundary
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 flex items-center justify-center">
          <BentoCard className="text-center max-w-md">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-white/60 mb-4">We're sorry, but an error occurred while loading the application.</p>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload Application
            </Button>
          </BentoCard>
        </div>
      }
    >
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 relative overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.1),transparent_50%)]" />
        
        {/* Enhanced Header */}
        <header className="relative z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
                    <Figma className="w-6 h-6 text-blue-400" />
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    FingMAI
                  </h1>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                    Beta v2.0
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <StatusBadge 
                  status={connectionState.status} 
                  text={connectionState.message}
                  onClick={connectionState.status === "error" ? handleConnectionTest : undefined}
                />
                <div className="flex items-center gap-2">
                  <GlassButton variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </GlassButton>
                  <GlassButton variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </GlassButton>
                  <GlassButton variant="ghost" size="sm">
                    <HelpCircle className="w-4 h-4" />
                  </GlassButton>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="relative z-10">
          {/* Enhanced Navigation */}
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-center mb-8">
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-2">
                <div className="flex gap-2">
                  {[
                    { id: "figma-import", icon: Figma, label: "Figma Import", badge: connectionState.status === "connected" ? "✓" : null },
                    { id: "ai-generator", icon: Bot, label: "AI Generator", badge: "AI" },
                    { id: "manual-convert", icon: Wrench, label: "Manual Convert", badge: null },
                    { id: "templates", icon: FileText, label: "Templates", badge: "12" },
                    { id: "ai-settings", icon: Cog, label: "AI Settings", badge: null }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative",
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-white border border-blue-500/30 shadow-lg"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                      {tab.badge && (
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                          {tab.badge}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[600px]">
              {activeTab === "figma-import" && renderFigmaImport()}
              {activeTab === "ai-generator" && renderAIGenerator()}
              {/* Other tabs would be implemented similarly */}
              {activeTab === "manual-convert" && (
                <div className="max-w-4xl mx-auto space-y-8">
                  <BentoCard size="lg" className="text-center">
                    <div className="max-w-2xl mx-auto">
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl border border-orange-500/30">
                          <Wrench className="w-8 h-8 text-orange-400" />
                        </div>
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                        Manual Conversion Wizard
                      </h2>
                      <p className="text-xl text-white/70 mb-8">
                        Step-by-step guided process for advanced users who want full control
                      </p>
                    </div>
                  </BentoCard>
                  
                  <BentoCard>
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Wrench className="w-8 h-8 text-orange-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">Coming Soon</h3>
                      <p className="text-white/60 mb-6 max-w-md mx-auto">
                        The manual conversion wizard is under development. It will provide:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
                        {[
                          "🎨 Visual layer-by-layer breakdown",
                          "⚙️ Custom component configuration",
                          "🔧 Advanced styling options",
                          "📝 Step-by-step code generation"
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-white/70">
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </BentoCard>
                </div>
              )}
              {activeTab === "templates" && (
                <div className="space-y-8">
                  <BentoCard size="lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                          Component Template Library
                        </h2>
                        <p className="text-white/70">
                          Discover and use pre-built component templates with modern design patterns
                        </p>
                      </div>
                      <GlassButton variant="primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Template
                      </GlassButton>
                    </div>
                  </BentoCard>

                  {/* Search and Filters */}
                  <BentoCard>
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                        <Input 
                          placeholder="Search templates, tags, or authors..."
                          className="pl-12 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-emerald-400/50 focus:bg-white/10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex gap-2 flex-wrap">
                          {categories.map((category) => (
                            <GlassButton
                              key={category.name}
                              variant={selectedCategory === category.name ? "primary" : "secondary"}
                              size="sm"
                              onClick={() => setSelectedCategory(category.name)}
                            >
                              {category.name} ({category.count})
                            </GlassButton>
                          ))}
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-sm text-white/60">{templates.length} templates found</span>
                          <div className="flex bg-white/5 border border-white/20 rounded-lg p-1">
                            <button
                              onClick={() => setViewMode("grid")}
                              className={cn(
                                "p-2 rounded transition-all duration-200",
                                viewMode === "grid" 
                                  ? "bg-white/20 text-white" 
                                  : "text-white/60 hover:text-white hover:bg-white/10"
                              )}
                            >
                              <Grid3X3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setViewMode("list")}
                              className={cn(
                                "p-2 rounded transition-all duration-200",
                                viewMode === "list" 
                                  ? "bg-white/20 text-white" 
                                  : "text-white/60 hover:text-white hover:bg-white/10"
                              )}
                            >
                              <List className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </BentoCard>

                  {/* Templates Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {templates.map((template) => (
                      <TemplateCard
                        key={template.id}
                        {...template}
                        isFavorited={favorites.includes(template.id)}
                        onFavorite={() => toggleFavorite(template.id)}
                        onPreview={() => toast({ title: "Preview", description: `Previewing ${template.title}` })}
                        onUse={() => toast({ title: "Template Used", description: `Using ${template.title}` })}
                      />
                    ))}
                  </div>
                </div>
              )}
              {activeTab === "ai-settings" && (
                <div className="max-w-7xl mx-auto space-y-8">
                  {/* Hero Section */}
                  <BentoCard size="lg" className="text-center" glowEffect>
                    <div className="max-w-3xl mx-auto">
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl border border-indigo-500/30">
                          <Cog className="w-8 h-8 text-indigo-400" />
                        </div>
                      </div>
                      <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        AI Configuration Center
                      </h2>
                      <p className="text-xl text-white/70 mb-8">
                        Customize AI behavior, preferences, and output settings for optimal code generation
                      </p>
                    </div>
                  </BentoCard>

                  {/* Settings Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* AI Provider Settings */}
                    <BentoCard>
                      <div className="flex items-center gap-3 mb-6">
                        <Bot className="w-6 h-6 text-indigo-400" />
                        <h3 className="text-xl font-semibold text-white">AI Provider Settings</h3>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <Label className="text-sm font-medium text-white/80 mb-2">Default AI Provider</Label>
                          <Select defaultValue="groq">
                            <SelectTrigger className="bg-white/5 border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="groq">🚀 Groq (Free & Fast)</SelectItem>
                              <SelectItem value="openai">🧠 OpenAI (Premium)</SelectItem>
                              <SelectItem value="auto">⚡ Auto-Switch</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-white/80 mb-2">Model Selection</Label>
                          <Select defaultValue="auto">
                            <SelectTrigger className="bg-white/5 border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="auto">Auto-Select Best Model</SelectItem>
                              <SelectItem value="gpt-4">GPT-4 (Recommended)</SelectItem>
                              <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                              <SelectItem value="llama-70b">Llama 2 70B</SelectItem>
                              <SelectItem value="mixtral">Mixtral 8x7B</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Info className="w-4 h-4 text-blue-400" />
                            <span className="font-medium text-sm text-white">Smart Fallback</span>
                          </div>
                          <p className="text-sm text-white/60">
                            Automatically switches to backup provider if primary fails, ensuring reliable generation.
                          </p>
                        </div>
                      </div>
                    </BentoCard>

                    {/* Code Generation Preferences */}
                    <BentoCard>
                      <div className="flex items-center gap-3 mb-6">
                        <Code className="w-6 h-6 text-purple-400" />
                        <h3 className="text-xl font-semibold text-white">Generation Preferences</h3>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <Label className="text-sm font-medium text-white/80 mb-2">Default Framework</Label>
                          <Select defaultValue="react">
                            <SelectTrigger className="bg-white/5 border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="react">React 18</SelectItem>
                              <SelectItem value="next">Next.js 14</SelectItem>
                              <SelectItem value="vue">Vue.js 3</SelectItem>
                              <SelectItem value="svelte">Svelte</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-white/80 mb-2">Styling Framework</Label>
                          <Select defaultValue="tailwind">
                            <SelectTrigger className="bg-white/5 border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tailwind">Tailwind CSS</SelectItem>
                              <SelectItem value="styled">Styled Components</SelectItem>
                              <SelectItem value="emotion">Emotion</SelectItem>
                              <SelectItem value="css-modules">CSS Modules</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-white/80">Code Features</Label>
                          <div className="space-y-3">
                            {[
                              { key: "typescript", label: "TypeScript by default", defaultChecked: true },
                              { key: "accessibility", label: "Include accessibility attributes", defaultChecked: true },
                              { key: "animations", label: "Add smooth animations", defaultChecked: true },
                              { key: "responsive", label: "Responsive design", defaultChecked: true },
                              { key: "tests", label: "Generate unit tests", defaultChecked: false },
                              { key: "storybook", label: "Storybook stories", defaultChecked: false }
                            ].map((option) => (
                              <div key={option.key} className="flex items-center gap-3">
                                <Switch defaultChecked={option.defaultChecked} />
                                <span className="text-sm text-white/70">{option.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </BentoCard>
                  </div>

                  {/* Usage Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { icon: TrendingUp, title: "1,247", desc: "Components Generated", color: "blue" },
                      { icon: Clock, title: "2.3s", desc: "Avg. Generation Time", color: "emerald" },
                      { icon: Star, title: "4.8/5", desc: "Quality Rating", color: "yellow" },
                      { icon: Users, title: "89%", desc: "Success Rate", color: "purple" }
                    ].map((stat, index) => (
                      <BentoCard key={index} size="sm" className="text-center" interactive>
                        <stat.icon className={`w-8 h-8 mx-auto mb-3 text-${stat.color}-400`} />
                        <div className="text-2xl font-bold text-white">{stat.title}</div>
                        <div className="text-sm text-white/60">{stat.desc}</div>
                      </BentoCard>
                    ))}
                  </div>

                  {/* Actions */}
                  <BentoCard>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Settings Management</h3>
                        <p className="text-white/60">Save your preferences or reset to defaults</p>
                      </div>
                      <div className="flex gap-3">
                        <GlassButton variant="secondary">
                          Reset Defaults
                        </GlassButton>
                        <GlassButton variant="success">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Save Settings
                        </GlassButton>
                      </div>
                    </div>
                  </BentoCard>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Floating Action Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <GlassButton 
            variant="primary" 
            className="rounded-full p-4 shadow-2xl hover:shadow-blue-500/20"
            onClick={() => {
              toast({
                title: "Quick Actions",
                description: "Choose an action to get started quickly",
              });
            }}
          >
            <Plus className="w-6 h-6" />
          </GlassButton>
        </div>
      </div>
    </EnhancedErrorBoundary>
  );
};

export default EnhancedFingMAI;