import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit, Save, X, Eye, EyeOff, ArrowLeft, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Service {
  id: string;
  slug: string;
  price: number;
  service_type: string;
  duration_minutes: number | null;
  is_active: boolean;
  image_url?: string;
  translation?: {
    title: string;
    summary: string;
    description: string;
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
  };
  features?: string[];
}

interface ServiceTranslation {
  title: string;
  summary: string;
  description: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
}

interface ServiceManagerProps {
  onBack: () => void;
}

const ServiceManager: React.FC<ServiceManagerProps> = ({ onBack }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [editingServiceData, setEditingServiceData] = useState<Service | null>(null);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'gr', name: 'Ελληνικά', flag: '🇬🇷' }
  ];

  const serviceTypes = [
    { value: 'free_pdf', label: 'Free PDF Book' },
    { value: 'paid_pdf', label: 'Paid PDF Book' },
    { value: 'free_consultation', label: 'Free Consultation' },
    { value: 'paid_consultation', label: 'Paid Consultation' }
  ];

  // Initial form state
  const initialServiceForm = {
    slug: '',
    price: 0,
    service_type: 'paid_consultation',
    duration_minutes: 60,
    is_active: true,
    image_url: ''
  };

  const initialTranslationForm: ServiceTranslation = {
    title: '',
    summary: '',
    description: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: ''
  };

  const [serviceForm, setServiceForm] = useState(initialServiceForm);
  const [translationForms, setTranslationForms] = useState<Record<string, ServiceTranslation>>({
    en: { ...initialTranslationForm },
    es: { ...initialTranslationForm },
    gr: { ...initialTranslationForm }
  });
  const [featureForms, setFeatureForms] = useState<Record<string, string[]>>({
    en: [''],
    es: [''],
    gr: ['']
  });

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Auto-generate slug when English title changes
  useEffect(() => {
    if (translationForms.en.title && !editingServiceData) {
      const slug = generateSlug(translationForms.en.title);
      setServiceForm(prev => ({ ...prev, slug }));
    }
  }, [translationForms.en.title, editingServiceData]);

  // Fetch services
  const fetchServices = async () => {
    try {
      setLoading(true);
      
      const { data: servicesData, error: servicesError } = await supabase
        .from('services_new_2025_12_11_16_00')
        .select(`
          *,
          service_translations_2025_12_11_16_00!inner(
            title,
            summary,
            description,
            seo_title,
            seo_description,
            seo_keywords
          )
        `)
        .eq('service_translations_2025_12_11_16_00.language_code', currentLanguage)
        .order('created_at', { ascending: false });

      if (servicesError) throw servicesError;

      // Fetch features for each service
      const servicesWithFeatures = await Promise.all(
        (servicesData || []).map(async (service) => {
          const { data: featuresData } = await supabase
            .from('service_features_2025_12_11_16_00')
            .select('feature_text')
            .eq('service_id', service.id)
            .eq('language_code', currentLanguage)
            .order('order_index');

          return {
            ...service,
            translation: service.service_translations_2025_12_11_16_00[0] || null,
            features: featuresData?.map(f => f.feature_text) || []
          };
        })
      );

      setServices(servicesWithFeatures);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch services',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [currentLanguage]);

  // Add feature
  const addFeature = (languageCode: string) => {
    setFeatureForms(prev => ({
      ...prev,
      [languageCode]: [...prev[languageCode], '']
    }));
  };

  // Remove feature
  const removeFeature = (languageCode: string, index: number) => {
    setFeatureForms(prev => ({
      ...prev,
      [languageCode]: prev[languageCode].filter((_, i) => i !== index)
    }));
  };

  // Update feature
  const updateFeature = (languageCode: string, index: number, value: string) => {
    setFeatureForms(prev => ({
      ...prev,
      [languageCode]: prev[languageCode].map((feature, i) => i === index ? value : feature)
    }));
  };

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload JPEG, PNG, WebP, or GIF images.');
      }

      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        throw new Error('File size too large. Please upload images smaller than 50MB.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `services/service-${Date.now()}.${fileExt}`;
      
      console.log('Uploading service image:', fileName, 'Size:', file.size, 'Type:', file.type);
      
      const { data, error: uploadError } = await supabase.storage
        .from('service-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', data);

      const { data: { publicUrl } } = supabase.storage
        .from('service-images')
        .getPublicUrl(fileName);

      console.log('Public URL:', publicUrl);

      setServiceForm(prev => ({ ...prev, image_url: publicUrl }));
      
      toast({
        title: 'Success',
        description: 'Image uploaded successfully'
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload image. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Create service
  const createService = async () => {
    try {
      // Validation
      for (const lang of languages) {
        if (!translationForms[lang.code].title || !translationForms[lang.code].summary || !translationForms[lang.code].description) {
          throw new Error(`Please fill in all required fields for ${lang.name}`);
        }
        if (translationForms[lang.code].summary.length > 200) {
          throw new Error(`Summary for ${lang.name} must be 200 characters or less`);
        }
        if (translationForms[lang.code].seo_description && translationForms[lang.code].seo_description.length > 160) {
          throw new Error(`SEO description for ${lang.name} must be 160 characters or less`);
        }
      }

      // Create service
      const { data: serviceData, error: serviceError } = await supabase
        .from('services_new_2025_12_11_16_00')
        .insert([serviceForm])
        .select()
        .single();

      if (serviceError) throw serviceError;

      // Create translations
      const translationsToInsert = languages.map(lang => ({
        service_id: serviceData.id,
        language_code: lang.code,
        ...translationForms[lang.code]
      }));

      const { error: translationsError } = await supabase
        .from('service_translations_2025_12_11_16_00')
        .insert(translationsToInsert);

      if (translationsError) throw translationsError;

      // Create features
      const featuresToInsert = languages.flatMap(lang => 
        featureForms[lang.code]
          .filter(feature => feature.trim())
          .map((feature, index) => ({
            service_id: serviceData.id,
            language_code: lang.code,
            feature_text: feature.trim(),
            order_index: index
          }))
      );

      if (featuresToInsert.length > 0) {
        const { error: featuresError } = await supabase
          .from('service_features_2025_12_11_16_00')
          .insert(featuresToInsert);

        if (featuresError) throw featuresError;
      }

      toast({
        title: 'Success',
        description: 'Service created successfully'
      });

      setShowCreateForm(false);
      resetForms();
      fetchServices();
    } catch (error: any) {
      console.error('Error creating service:', error);
      toast({
        title: 'Creation Failed',
        description: error.message || 'Failed to create service',
        variant: 'destructive'
      });
    }
  };

  // Reset forms
  const resetForms = () => {
    setServiceForm(initialServiceForm);
    setTranslationForms({
      en: { ...initialTranslationForm },
      es: { ...initialTranslationForm },
      gr: { ...initialTranslationForm }
    });
    setFeatureForms({
      en: [''],
      es: [''],
      gr: ['']
    });
  };

  // Load service data for editing
  const loadServiceForEdit = async (serviceId: string) => {
    try {
      // Fetch service with all translations
      const { data: serviceData, error: serviceError } = await supabase
        .from('services_new_2025_12_11_16_00')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (serviceError) throw serviceError;

      // Fetch all translations
      const { data: translationsData, error: translationsError } = await supabase
        .from('service_translations_2025_12_11_16_00')
        .select('*')
        .eq('service_id', serviceId);

      if (translationsError) throw translationsError;

      // Fetch all features
      const { data: featuresData, error: featuresError } = await supabase
        .from('service_features_2025_12_11_16_00')
        .select('*')
        .eq('service_id', serviceId)
        .order('order_index');

      if (featuresError) throw featuresError;

      // Set service form data
      setServiceForm({
        slug: serviceData.slug,
        price: serviceData.price,
        service_type: serviceData.service_type,
        duration_minutes: serviceData.duration_minutes,
        is_active: serviceData.is_active,
        image_url: serviceData.image_url || ''
      });

      // Set translation forms
      const newTranslationForms: Record<string, ServiceTranslation> = {
        en: { ...initialTranslationForm },
        es: { ...initialTranslationForm },
        gr: { ...initialTranslationForm }
      };

      translationsData?.forEach(translation => {
        newTranslationForms[translation.language_code] = {
          title: translation.title,
          summary: translation.summary,
          description: translation.description,
          seo_title: translation.seo_title || '',
          seo_description: translation.seo_description || '',
          seo_keywords: translation.seo_keywords || ''
        };
      });

      setTranslationForms(newTranslationForms);

      // Set feature forms
      const newFeatureForms: Record<string, string[]> = {
        en: [''],
        es: [''],
        gr: ['']
      };

      languages.forEach(lang => {
        const langFeatures = featuresData?.filter(f => f.language_code === lang.code) || [];
        if (langFeatures.length > 0) {
          newFeatureForms[lang.code] = langFeatures.map(f => f.feature_text);
        }
      });

      setFeatureForms(newFeatureForms);
      setEditingServiceData(serviceData);
      setShowCreateForm(true);
    } catch (error: any) {
      console.error('Error loading service for edit:', error);
      toast({
        title: 'Error',
        description: 'Failed to load service data for editing',
        variant: 'destructive'
      });
    }
  };

  // Update service
  const updateService = async () => {
    if (!editingServiceData) return;

    try {
      // Validation
      for (const lang of languages) {
        if (!translationForms[lang.code].title || !translationForms[lang.code].summary || !translationForms[lang.code].description) {
          throw new Error(`Please fill in all required fields for ${lang.name}`);
        }
        if (translationForms[lang.code].summary.length > 200) {
          throw new Error(`Summary for ${lang.name} must be 200 characters or less`);
        }
        if (translationForms[lang.code].seo_description && translationForms[lang.code].seo_description.length > 160) {
          throw new Error(`SEO description for ${lang.name} must be 160 characters or less`);
        }
      }

      // Update service
      const { error: serviceError } = await supabase
        .from('services_new_2025_12_11_16_00')
        .update(serviceForm)
        .eq('id', editingServiceData.id);

      if (serviceError) throw serviceError;

      // Delete existing translations and features
      await supabase
        .from('service_translations_2025_12_11_16_00')
        .delete()
        .eq('service_id', editingServiceData.id);

      await supabase
        .from('service_features_2025_12_11_16_00')
        .delete()
        .eq('service_id', editingServiceData.id);

      // Insert updated translations
      const translationsToInsert = languages.map(lang => ({
        service_id: editingServiceData.id,
        language_code: lang.code,
        ...translationForms[lang.code]
      }));

      const { error: translationsError } = await supabase
        .from('service_translations_2025_12_11_16_00')
        .insert(translationsToInsert);

      if (translationsError) throw translationsError;

      // Insert updated features
      const featuresToInsert = languages.flatMap(lang => 
        featureForms[lang.code]
          .filter(feature => feature.trim())
          .map((feature, index) => ({
            service_id: editingServiceData.id,
            language_code: lang.code,
            feature_text: feature.trim(),
            order_index: index
          }))
      );

      if (featuresToInsert.length > 0) {
        const { error: featuresError } = await supabase
          .from('service_features_2025_12_11_16_00')
          .insert(featuresToInsert);

        if (featuresError) throw featuresError;
      }

      toast({
        title: 'Success',
        description: 'Service updated successfully'
      });

      setShowCreateForm(false);
      setEditingService(null);
      setEditingServiceData(null);
      resetForms();
      fetchServices();
    } catch (error: any) {
      console.error('Error updating service:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update service',
        variant: 'destructive'
      });
    }
  };

  // Toggle service active status
  const toggleServiceActive = async (serviceId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('services_new_2025_12_11_16_00')
        .update({ is_active: !isActive })
        .eq('id', serviceId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Service ${!isActive ? 'activated' : 'deactivated'}`
      });

      fetchServices();
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: 'Error',
        description: 'Failed to update service',
        variant: 'destructive'
      });
    }
  };

  // Delete service
  const deleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('services_new_2025_12_11_16_00')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Service deleted successfully'
      });

      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete service',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Service Management</h2>
            <p className="text-muted-foreground">Create and manage your nutrition services</p>
          </div>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="gradient-accent text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create New Service
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingServiceData ? 'Edit Service' : 'Create New Service'}</CardTitle>
            <CardDescription>
              {editingServiceData ? 'Update service information and content' : 'Add a new service with multilingual content and features'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="content">Content & SEO</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Service Type</Label>
                    <Select 
                      value={serviceForm.service_type} 
                      onValueChange={(value) => setServiceForm(prev => ({ ...prev, service_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Price (€)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={serviceForm.price}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                {(serviceForm.service_type.includes('consultation')) && (
                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={serviceForm.duration_minutes || ''}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || null }))}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>URL Slug (auto-generated)</Label>
                  <Input
                    value={serviceForm.slug}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="service-url-slug"
                  />
                  <p className="text-sm text-muted-foreground">
                    URL: /services/{serviceForm.slug}
                  </p>
                </div>

                {/* Service Image Upload */}
                <div className="space-y-2">
                  <Label>Service Image</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {serviceForm.image_url ? (
                      <div className="space-y-2">
                        <img 
                          src={serviceForm.image_url} 
                          alt="Service preview" 
                          className="max-h-32 mx-auto rounded"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setServiceForm(prev => ({ ...prev, image_url: '' }))}
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Settings className="h-12 w-12 mx-auto text-gray-400" />
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file);
                            }}
                            className="hidden"
                            id="service-image-upload"
                          />
                          <Label htmlFor="service-image-upload" className="cursor-pointer">
                            <Button variant="outline" asChild>
                              <span>
                                <Plus className="h-4 w-4 mr-2" />
                                Upload Image
                              </span>
                            </Button>
                          </Label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    {languages.map(lang => (
                      <TabsTrigger key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {languages.map(lang => (
                    <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Title *</Label>
                          <Input
                            value={translationForms[lang.code].title}
                            onChange={(e) => setTranslationForms(prev => ({
                              ...prev,
                              [lang.code]: { ...prev[lang.code], title: e.target.value }
                            }))}
                            placeholder="Service title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Summary * (max 200 chars)</Label>
                          <Textarea
                            value={translationForms[lang.code].summary}
                            onChange={(e) => setTranslationForms(prev => ({
                              ...prev,
                              [lang.code]: { ...prev[lang.code], summary: e.target.value }
                            }))}
                            placeholder="Brief service description for cards"
                            maxLength={200}
                            rows={3}
                          />
                          <p className="text-sm text-muted-foreground">
                            {translationForms[lang.code].summary.length}/200 characters
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description *</Label>
                        <Textarea
                          value={translationForms[lang.code].description}
                          onChange={(e) => setTranslationForms(prev => ({
                            ...prev,
                            [lang.code]: { ...prev[lang.code], description: e.target.value }
                          }))}
                          placeholder="Detailed service description"
                          rows={6}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>SEO Title</Label>
                          <Input
                            value={translationForms[lang.code].seo_title}
                            onChange={(e) => setTranslationForms(prev => ({
                              ...prev,
                              [lang.code]: { ...prev[lang.code], seo_title: e.target.value }
                            }))}
                            placeholder="SEO optimized title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>SEO Description (max 160 chars)</Label>
                          <Textarea
                            value={translationForms[lang.code].seo_description}
                            onChange={(e) => setTranslationForms(prev => ({
                              ...prev,
                              [lang.code]: { ...prev[lang.code], seo_description: e.target.value }
                            }))}
                            placeholder="SEO meta description"
                            maxLength={160}
                            rows={2}
                          />
                          <p className="text-sm text-muted-foreground">
                            {translationForms[lang.code].seo_description.length}/160 characters
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>SEO Keywords</Label>
                        <Input
                          value={translationForms[lang.code].seo_keywords}
                          onChange={(e) => setTranslationForms(prev => ({
                            ...prev,
                            [lang.code]: { ...prev[lang.code], seo_keywords: e.target.value }
                          }))}
                          placeholder="keyword1, keyword2, keyword3"
                        />
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </TabsContent>

              <TabsContent value="features" className="space-y-4">
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    {languages.map(lang => (
                      <TabsTrigger key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {languages.map(lang => (
                    <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Service Features</Label>
                        {featureForms[lang.code].map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Input
                              value={feature}
                              onChange={(e) => updateFeature(lang.code, index, e.target.value)}
                              placeholder="Feature description"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeFeature(lang.code, index)}
                              disabled={featureForms[lang.code].length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addFeature(lang.code)}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Feature
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => { 
                setShowCreateForm(false); 
                setEditingService(null);
                setEditingServiceData(null);
                resetForms(); 
              }}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={editingServiceData ? updateService : createService} 
                className="gradient-accent text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingServiceData ? 'Update Service' : 'Create Service'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Services List */}
      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {service.translation?.title || 'Untitled Service'}
                    <Badge variant={service.is_active ? 'default' : 'secondary'}>
                      {service.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">
                      {serviceTypes.find(t => t.value === service.service_type)?.label}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    €{service.price} {service.duration_minutes && `• ${service.duration_minutes} min`} • /{service.slug}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleServiceActive(service.id, service.is_active)}
                  >
                    {service.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadServiceForEdit(service.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteService(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {service.translation?.summary}
                </p>
                {service.features && service.features.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Features:</Label>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                      {service.features.length > 3 && (
                        <li>... and {service.features.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Settings className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No services created yet</h3>
            <p className="text-muted-foreground mb-6">Create your first service to get started with your nutrition practice</p>
            <Button onClick={() => setShowCreateForm(true)} className="gradient-accent text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create First Service
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ServiceManager;