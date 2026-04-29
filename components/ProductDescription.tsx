"use client";

import { Info, CheckCircle, Zap, Target, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductDescriptionProps {
  description?: string;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  if (!description) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Info className="h-5 w-5" />
          Description
        </h3>
        <p className="text-gray-500 italic">No description available</p>
      </div>
    );
  }

  // Parse HTML content using text extraction that works in both SSR and browser.
  const parseDescription = (htmlContent: string) => {
    const decodeAndStrip = (text: string) =>
      text
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/\s+/g, " ")
        .trim();

    const firstParagraphMatch = htmlContent.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const mainDesc = decodeAndStrip(firstParagraphMatch?.[1] || htmlContent);

    const features: string[] = [];
    const featureListMatch = htmlContent.match(/<ol[^>]*>([\s\S]*?)<\/ol>/i);
    if (featureListMatch?.[1]) {
      const listItemMatches = featureListMatch[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi);
      for (const item of listItemMatches) {
        const value = decodeAndStrip(item[1] || "");
        if (value) features.push(value);
      }
    }

    const specs: { label: string; value: string }[] = [];
    const paragraphMatches = htmlContent.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi);
    for (const p of paragraphMatches) {
      const text = decodeAndStrip(p[1] || "");
      if (text.includes(":") && !/key features/i.test(text)) {
        const [label, ...rest] = text.split(":");
        const value = rest.join(":").trim();
        if (label?.trim() && value) {
          specs.push({ label: label.trim(), value });
        }
      }
    }

    return { mainDesc, features, specs };
  };

  const { mainDesc, features, specs } = parseDescription(description);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Info className="h-5 w-5" />
        Product Description
      </h3>
      
      {/* Main Description */}
      {mainDesc && (
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <p className="text-gray-700 leading-relaxed">{mainDesc}</p>
          </CardContent>
        </Card>
      )}
      
      {/* Key Features */}
      {features.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-gray-700">{feature}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Technical Specifications */}
      {specs.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Technical Specifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {specs.map((spec, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="font-medium text-gray-700">{spec.label}:</span>
                  <Badge variant="outline" className="font-mono text-sm">
                    {spec.value}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Performance Highlights */}
      {specs.some(spec => spec.label.includes('Accuracy') || spec.label.includes('Speed') || spec.label.includes('Power')) && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Performance Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specs
                .filter(spec => 
                  spec.label.includes('Accuracy') || 
                  spec.label.includes('Speed') || 
                  spec.label.includes('Power') ||
                  spec.label.includes('Acceleration')
                )
                .map((spec, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Wrench className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm text-gray-600">{spec.label}</span>
                    </div>
                    <p className="text-lg font-bold text-blue-700">{spec.value}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
