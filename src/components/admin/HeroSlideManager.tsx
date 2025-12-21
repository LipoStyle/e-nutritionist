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
import { Plus, Upload, Eye, EyeOff, Trash2, Edit, Save, X, Image as ImageIcon } from 'lucide-react';

interface HeroSlide {
  id: string;
  order_index: number;
  background_image_url: string | null;
  layer_opacity: number;
  layer_type: string;
  layer_direction: string;
  layer_color_1: string;
  layer_color_2: string | null;
  layer_color_3: string | null;
  is_active: boolean;
}

interface SlideTranslation {
  id: string;
  slide_id: string;
  language_code: string;
  h1_title: string;
  paragraph: string;
  primary_button_text: string;
  primary_button_url: string;
  secondary_button_text: string;
  secondary_button_url: string;
}

const HeroSlideManager: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [translations, setTranslations] = useState<Record<string, SlideTranslation[]>>({});
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'gr', name: 'Ελληνικά', flag: '🇬🇷' }
  ];

  // Initial form state
  const initialSlideForm = {
    order_index: 0,
    background_image_url: '',
    layer_opacity: 0.7,
    layer_type: 'gradient_2',
    layer_direction: 'horizontal',
    layer_color_1: '#075056',
    layer_color_2: '#ff5b04',
    layer_color_3: '#e4eef0',
    is_active: true
  };

  const handleEditImageUpload = async (file: File) => {
    try {
      const publicUrl = await uploadSlideImage(file);
      setEditSlideForm(prev => (prev ? { ...prev, background_image_url: publicUrl } : prev));

      toast({
        title: 'Success',
        description: 'Image uploaded successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload image. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const initialTranslationForm = {
    h1_title: 'Sample Title',
    paragraph: 'Sample description for the slide content.',
    primary_button_text: 'Get Started',
    primary_button_url: '/contact',
    secondary_button_text: 'Learn More',
    secondary_button_url: '/services'
  };

  const [slideForm, setSlideForm] = useState(initialSlideForm);
  const [translationForms, setTranslationForms] = useState<Record<string, typeof initialTranslationForm>>({
    en: { ...initialTranslationForm },
    es: { ...initialTranslationForm },
    gr: { ...initialTranslationForm }
  });
  const [editSlideForm, setEditSlideForm] = useState<HeroSlide | null>(null);
  const [editTranslationForms, setEditTranslationForms] = useState<Record<string, typeof initialTranslationForm>>({
    en: { ...initialTranslationForm },
    es: { ...initialTranslationForm },
    gr: { ...initialTranslationForm }
  });

  // Fetch slides and translations
  const fetchSlides = async () => {
    try {
      setLoading(true);
      
      // Fetch slides
      const { data: slidesData, error: slidesError } = await supabase
        .from('hero_slides_2025_12_11_15_30')
        .select('*')
        .order('order_index');

      if (slidesError) throw slidesError;

      // Fetch translations
      const { data: translationsData, error: translationsError } = await supabase
        .from('slide_translations_2025_12_11_15_30')
        .select('*');

      if (translationsError) throw translationsError;

      // Group translations by slide_id
      const translationsBySlide: Record<string, SlideTranslation[]> = {};
      translationsData?.forEach((translation) => {
        if (!translationsBySlide[translation.slide_id]) {
          translationsBySlide[translation.slide_id] = [];
        }
        translationsBySlide[translation.slide_id].push(translation);
      });

      setSlides(slidesData || []);
      setTranslations(translationsBySlide);
    } catch (error) {
      console.error('Error fetching slides:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch slides',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const uploadSlideImage = async (file: File) => {
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
      const fileName = `slides/slide-${Date.now()}.${fileExt}`;
      
      console.log('Uploading file:', fileName, 'Size:', file.size, 'Type:', file.type);
      
      const { data, error: uploadError } = await supabase.storage
        .from('slide-images')
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
        .from('slide-images')
        .getPublicUrl(fileName);

      console.log('Public URL:', publicUrl);

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      const publicUrl = await uploadSlideImage(file);
      setSlideForm(prev => ({ ...prev, background_image_url: publicUrl }));
      
      toast({
        title: 'Success',
        description: 'Image uploaded successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload image. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Create new slide
  const createSlide = async () => {
    try {
      // Validate required fields
      const requiredFields = ['h1_title', 'paragraph', 'primary_button_text', 'primary_button_url', 'secondary_button_text', 'secondary_button_url'];
      
      for (const lang of languages) {
        for (const field of requiredFields) {
          if (!translationForms[lang.code][field as keyof typeof translationForms[typeof lang.code]]) {
            throw new Error(`Please fill in all fields for ${lang.name}`);
          }
        }
      }

      console.log('Creating slide with data:', slideForm);
      console.log('Translation forms:', translationForms);

      // Create slide
      const { data: slideData, error: slideError } = await supabase
        .from('hero_slides_2025_12_11_15_30')
        .insert([slideForm])
        .select()
        .single();

      if (slideError) {
        console.error('Slide creation error:', slideError);
        throw slideError;
      }

      console.log('Slide created successfully:', slideData);

      // Create translations for all languages
      const translationsToInsert = languages.map(lang => ({
        slide_id: slideData.id,
        language_code: lang.code,
        ...translationForms[lang.code]
      }));

      console.log('Inserting translations:', translationsToInsert);

      const { error: translationsError } = await supabase
        .from('slide_translations_2025_12_11_15_30')
        .insert(translationsToInsert);

      if (translationsError) {
        console.error('Translation creation error:', translationsError);
        throw translationsError;
      }

      console.log('Translations created successfully');

      toast({
        title: 'Success',
        description: 'Slide created successfully'
      });

      setShowCreateForm(false);
      setSlideForm(initialSlideForm);
      setTranslationForms({
        en: { ...initialTranslationForm },
        es: { ...initialTranslationForm },
        gr: { ...initialTranslationForm }
      });
      fetchSlides();
    } catch (error: any) {
      console.error('Error creating slide:', error);
      toast({
        title: 'Creation Failed',
        description: error.message || 'Failed to create slide. Please check all required fields.',
        variant: 'destructive'
      });
    }
  };

  // Toggle slide active status
  const toggleSlideActive = async (slideId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('hero_slides_2025_12_11_15_30')
        .update({ is_active: !isActive })
        .eq('id', slideId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Slide ${!isActive ? 'activated' : 'deactivated'}`
      });

      fetchSlides();
    } catch (error) {
      console.error('Error updating slide:', error);
      toast({
        title: 'Error',
        description: 'Failed to update slide',
        variant: 'destructive'
      });
    }
  };

  // Delete slide
  const deleteSlide = async (slideId: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      const { error } = await supabase
        .from('hero_slides_2025_12_11_15_30')
        .delete()
        .eq('id', slideId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Slide deleted successfully'
      });

      fetchSlides();
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete slide',
        variant: 'destructive'
      });
    }
  };

  const startEditingSlide = (slide: HeroSlide) => {
    if (editingSlide === slide.id) {
      cancelEdit();
      return;
    }

    const translationData = translations[slide.id] || [];
    const forms = languages.reduce((acc, lang) => {
      const translation = translationData.find(t => t.language_code === lang.code);
      acc[lang.code] = {
        h1_title: translation?.h1_title || '',
        paragraph: translation?.paragraph || '',
        primary_button_text: translation?.primary_button_text || '',
        primary_button_url: translation?.primary_button_url || '',
        secondary_button_text: translation?.secondary_button_text || '',
        secondary_button_url: translation?.secondary_button_url || ''
      };
      return acc;
    }, {} as Record<string, typeof initialTranslationForm>);

    setEditSlideForm({ ...slide });
    setEditTranslationForms(forms);
    setEditingSlide(slide.id);
  };

  const cancelEdit = () => {
    setEditingSlide(null);
    setEditSlideForm(null);
    setEditTranslationForms({
      en: { ...initialTranslationForm },
      es: { ...initialTranslationForm },
      gr: { ...initialTranslationForm }
    });
  };

  const saveSlideChanges = async () => {
    if (!editingSlide || !editSlideForm) return;

    try {
      const slideUpdateData = {
        order_index: editSlideForm.order_index,
        background_image_url: editSlideForm.background_image_url,
        layer_opacity: editSlideForm.layer_opacity,
        layer_type: editSlideForm.layer_type,
        layer_direction: editSlideForm.layer_direction,
        layer_color_1: editSlideForm.layer_color_1,
        layer_color_2: editSlideForm.layer_color_2,
        layer_color_3: editSlideForm.layer_color_3,
        is_active: editSlideForm.is_active
      };

      const { error: slideError } = await supabase
        .from('hero_slides_2025_12_11_15_30')
        .update(slideUpdateData)
        .eq('id', editingSlide);

      if (slideError) throw slideError;

      const translationsToUpsert = languages.map(lang => {
        const translationForm = editTranslationForms[lang.code] || initialTranslationForm;
        return {
          slide_id: editingSlide,
          language_code: lang.code,
          ...translationForm
        };
      });

      const { error: translationsError } = await supabase
        .from('slide_translations_2025_12_11_15_30')
        .upsert(translationsToUpsert, { onConflict: 'slide_id,language_code' });

      if (translationsError) throw translationsError;

      toast({
        title: 'Success',
        description: 'Slide updated successfully'
      });

      cancelEdit();
      fetchSlides();
    } catch (error: any) {
      console.error('Error updating slide:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update slide. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Generate gradient CSS
  const generateGradientCSS = (slide: HeroSlide) => {
    const { layer_type, layer_direction, layer_color_1, layer_color_2, layer_color_3, layer_opacity } = slide;
    
    let gradient = '';
    if (layer_type === 'single') {
      gradient = layer_color_1;
    } else if (layer_type === 'gradient_2') {
      const direction = layer_direction === 'radial' ? 'radial-gradient(circle,' : 
                      layer_direction === 'vertical' ? 'linear-gradient(to bottom,' : 'linear-gradient(to right,';
      gradient = `${direction} ${layer_color_1}, ${layer_color_2})`;
    } else if (layer_type === 'gradient_3') {
      const direction = layer_direction === 'radial' ? 'radial-gradient(circle,' : 
                      layer_direction === 'vertical' ? 'linear-gradient(to bottom,' : 'linear-gradient(to right,';
      gradient = `${direction} ${layer_color_1}, ${layer_color_2}, ${layer_color_3})`;
    }

    return {
      background: gradient,
      opacity: layer_opacity
    };
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading slides...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Hero Slide Manager</h2>
          <p className="text-muted-foreground">Manage homepage hero slides with multilingual content</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="gradient-accent text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create New Slide
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Hero Slide</CardTitle>
            <CardDescription>Add a new slide with multilingual content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="design" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="design">Design & Layout</TabsTrigger>
                <TabsTrigger value="content">Content & Translations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="design" className="space-y-4">
                {/* Background Image Upload */}
                <div className="space-y-2">
                  <Label>Background Image</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {slideForm.background_image_url ? (
                      <div className="space-y-2">
                        <img 
                          src={slideForm.background_image_url} 
                          alt="Background preview" 
                          className="max-h-32 mx-auto rounded"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSlideForm(prev => ({ ...prev, background_image_url: '' }))}
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file);
                            }}
                            className="hidden"
                            id="image-upload"
                          />
                          <Label htmlFor="image-upload" className="cursor-pointer">
                            <Button variant="outline" asChild>
                              <span>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Image
                              </span>
                            </Button>
                          </Label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Layer Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Layer Type</Label>
                    <Select 
                      value={slideForm.layer_type} 
                      onValueChange={(value) => setSlideForm(prev => ({ ...prev, layer_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single Color</SelectItem>
                        <SelectItem value="gradient_2">2 Color Gradient</SelectItem>
                        <SelectItem value="gradient_3">3 Color Gradient</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Layer Direction</Label>
                    <Select 
                      value={slideForm.layer_direction} 
                      onValueChange={(value) => setSlideForm(prev => ({ ...prev, layer_direction: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="horizontal">Horizontal</SelectItem>
                        <SelectItem value="vertical">Vertical</SelectItem>
                        <SelectItem value="radial">Radial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Color Inputs */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Color 1</Label>
                    <Input
                      type="color"
                      value={slideForm.layer_color_1}
                      onChange={(e) => setSlideForm(prev => ({ ...prev, layer_color_1: e.target.value }))}
                    />
                  </div>
                  {slideForm.layer_type !== 'single' && (
                    <div className="space-y-2">
                      <Label>Color 2</Label>
                      <Input
                        type="color"
                        value={slideForm.layer_color_2 || '#ff5b04'}
                        onChange={(e) => setSlideForm(prev => ({ ...prev, layer_color_2: e.target.value }))}
                      />
                    </div>
                  )}
                  {slideForm.layer_type === 'gradient_3' && (
                    <div className="space-y-2">
                      <Label>Color 3</Label>
                      <Input
                        type="color"
                        value={slideForm.layer_color_3 || '#e4eef0'}
                        onChange={(e) => setSlideForm(prev => ({ ...prev, layer_color_3: e.target.value }))}
                      />
                    </div>
                  )}
                </div>

                {/* Opacity */}
                <div className="space-y-2">
                  <Label>Layer Opacity: {slideForm.layer_opacity}</Label>
                  <Input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={slideForm.layer_opacity}
                    onChange={(e) => setSlideForm(prev => ({ ...prev, layer_opacity: parseFloat(e.target.value) }))}
                  />
                </div>

                {/* Preview */}
                <div className="space-y-2">
                  <Label>Layer Preview</Label>
                  <div 
                    className="h-20 rounded border"
                    style={generateGradientCSS(slideForm as HeroSlide)}
                  />
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
                          <Label>H1 Title</Label>
                          <Input
                            value={translationForms[lang.code].h1_title}
                            onChange={(e) => setTranslationForms(prev => ({
                              ...prev,
                              [lang.code]: { ...prev[lang.code], h1_title: e.target.value }
                            }))}
                            placeholder="Main title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Paragraph</Label>
                          <Textarea
                            value={translationForms[lang.code].paragraph}
                            onChange={(e) => setTranslationForms(prev => ({
                              ...prev,
                              [lang.code]: { ...prev[lang.code], paragraph: e.target.value }
                            }))}
                            placeholder="Description text"
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Primary Button Text</Label>
                          <Input
                            value={translationForms[lang.code].primary_button_text}
                            onChange={(e) => setTranslationForms(prev => ({
                              ...prev,
                              [lang.code]: { ...prev[lang.code], primary_button_text: e.target.value }
                            }))}
                            placeholder="Button text"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Primary Button URL</Label>
                          <Input
                            value={translationForms[lang.code].primary_button_url}
                            onChange={(e) => setTranslationForms(prev => ({
                              ...prev,
                              [lang.code]: { ...prev[lang.code], primary_button_url: e.target.value }
                            }))}
                            placeholder="/contact"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Secondary Button Text</Label>
                          <Input
                            value={translationForms[lang.code].secondary_button_text}
                            onChange={(e) => setTranslationForms(prev => ({
                              ...prev,
                              [lang.code]: { ...prev[lang.code], secondary_button_text: e.target.value }
                            }))}
                            placeholder="Button text"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Secondary Button URL</Label>
                          <Input
                            value={translationForms[lang.code].secondary_button_url}
                            onChange={(e) => setTranslationForms(prev => ({
                              ...prev,
                              [lang.code]: { ...prev[lang.code], secondary_button_url: e.target.value }
                            }))}
                            placeholder="/services"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={createSlide} className="gradient-accent text-white">
                <Save className="h-4 w-4 mr-2" />
                Create Slide
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Slides List */}
      <div className="grid gap-4">
        {slides.map((slide) => (
          <Card key={slide.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Slide #{slide.order_index + 1}
                    <Badge variant={slide.is_active ? 'default' : 'secondary'}>
                      {slide.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {translations[slide.id]?.find(t => t.language_code === 'en')?.h1_title || 'No title'}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSlideActive(slide.id, slide.is_active)}
                  >
                    {slide.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditingSlide(slide)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteSlide(slide.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Preview */}
                <div className="space-y-2">
                  <Label>Visual Preview</Label>
                  <div className="relative h-32 rounded border overflow-hidden">
                    {slide.background_image_url && (
                      <img 
                        src={slide.background_image_url} 
                        alt="Background" 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    <div 
                      className="absolute inset-0"
                      style={generateGradientCSS(slide)}
                    />
                  </div>
                </div>

                {/* Translations Preview */}
                <div className="space-y-2">
                  <Label>Content Preview</Label>
                  <div className="space-y-2">
                    {languages.map(lang => {
                      const translation = translations[slide.id]?.find(t => t.language_code === lang.code);
                      return (
                        <div key={lang.code} className="text-sm">
                          <strong>{lang.flag} {lang.name}:</strong> {translation?.h1_title || 'No translation'}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              {editingSlide === slide.id && editSlideForm && (
                <div className="mt-6 border-t pt-6 space-y-6">
                  <Tabs defaultValue="design" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="design">Design & Layout</TabsTrigger>
                      <TabsTrigger value="content">Content & Translations</TabsTrigger>
                    </TabsList>

                    <TabsContent value="design" className="space-y-4">
                      <div className="space-y-2">
                        <Label>Background Image</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          {editSlideForm.background_image_url ? (
                            <div className="space-y-2">
                              <img
                                src={editSlideForm.background_image_url}
                                alt="Background preview"
                                className="max-h-32 mx-auto rounded"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setEditSlideForm(prev =>
                                    prev ? { ...prev, background_image_url: '' } : prev
                                  )
                                }
                              >
                                Remove Image
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                              <div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleEditImageUpload(file);
                                  }}
                                  className="hidden"
                                  id={`edit-image-upload-${slide.id}`}
                                />
                                <Label htmlFor={`edit-image-upload-${slide.id}`} className="cursor-pointer">
                                  <Button variant="outline" asChild>
                                    <span>
                                      <Upload className="h-4 w-4 mr-2" />
                                      Upload Image
                                    </span>
                                  </Button>
                                </Label>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Layer Type</Label>
                          <Select
                            value={editSlideForm.layer_type}
                            onValueChange={(value) =>
                              setEditSlideForm(prev => (prev ? { ...prev, layer_type: value } : prev))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single">Single Color</SelectItem>
                              <SelectItem value="gradient_2">2 Color Gradient</SelectItem>
                              <SelectItem value="gradient_3">3 Color Gradient</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Layer Direction</Label>
                          <Select
                            value={editSlideForm.layer_direction}
                            onValueChange={(value) =>
                              setEditSlideForm(prev => (prev ? { ...prev, layer_direction: value } : prev))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="horizontal">Horizontal</SelectItem>
                              <SelectItem value="vertical">Vertical</SelectItem>
                              <SelectItem value="radial">Radial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Color 1</Label>
                          <Input
                            type="color"
                            value={editSlideForm.layer_color_1}
                            onChange={(e) =>
                              setEditSlideForm(prev => (prev ? { ...prev, layer_color_1: e.target.value } : prev))
                            }
                          />
                        </div>
                        {editSlideForm.layer_type !== 'single' && (
                          <div className="space-y-2">
                            <Label>Color 2</Label>
                            <Input
                              type="color"
                              value={editSlideForm.layer_color_2 || '#ff5b04'}
                              onChange={(e) =>
                                setEditSlideForm(prev => (prev ? { ...prev, layer_color_2: e.target.value } : prev))
                              }
                            />
                          </div>
                        )}
                        {editSlideForm.layer_type === 'gradient_3' && (
                          <div className="space-y-2">
                            <Label>Color 3</Label>
                            <Input
                              type="color"
                              value={editSlideForm.layer_color_3 || '#e4eef0'}
                              onChange={(e) =>
                                setEditSlideForm(prev => (prev ? { ...prev, layer_color_3: e.target.value } : prev))
                              }
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Layer Opacity: {editSlideForm.layer_opacity}</Label>
                        <Input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={editSlideForm.layer_opacity}
                          onChange={(e) =>
                            setEditSlideForm(prev =>
                              prev ? { ...prev, layer_opacity: parseFloat(e.target.value) } : prev
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Layer Preview</Label>
                        <div
                          className="h-20 rounded border"
                          style={generateGradientCSS(editSlideForm)}
                        />
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
                                <Label>H1 Title</Label>
                                <Input
                                  value={editTranslationForms[lang.code]?.h1_title || ''}
                                  onChange={(e) =>
                                    setEditTranslationForms(prev => ({
                                      ...prev,
                                      [lang.code]: {
                                        ...(prev[lang.code] || initialTranslationForm),
                                        h1_title: e.target.value
                                      }
                                    }))
                                  }
                                  placeholder="Main title"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Paragraph</Label>
                                <Textarea
                                  value={editTranslationForms[lang.code]?.paragraph || ''}
                                  onChange={(e) =>
                                    setEditTranslationForms(prev => ({
                                      ...prev,
                                      [lang.code]: {
                                        ...(prev[lang.code] || initialTranslationForm),
                                        paragraph: e.target.value
                                      }
                                    }))
                                  }
                                  placeholder="Description text"
                                  rows={3}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Primary Button Text</Label>
                                <Input
                                  value={editTranslationForms[lang.code]?.primary_button_text || ''}
                                  onChange={(e) =>
                                    setEditTranslationForms(prev => ({
                                      ...prev,
                                      [lang.code]: {
                                        ...(prev[lang.code] || initialTranslationForm),
                                        primary_button_text: e.target.value
                                      }
                                    }))
                                  }
                                  placeholder="Button text"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Primary Button URL</Label>
                                <Input
                                  value={editTranslationForms[lang.code]?.primary_button_url || ''}
                                  onChange={(e) =>
                                    setEditTranslationForms(prev => ({
                                      ...prev,
                                      [lang.code]: {
                                        ...(prev[lang.code] || initialTranslationForm),
                                        primary_button_url: e.target.value
                                      }
                                    }))
                                  }
                                  placeholder="/contact"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Secondary Button Text</Label>
                                <Input
                                  value={editTranslationForms[lang.code]?.secondary_button_text || ''}
                                  onChange={(e) =>
                                    setEditTranslationForms(prev => ({
                                      ...prev,
                                      [lang.code]: {
                                        ...(prev[lang.code] || initialTranslationForm),
                                        secondary_button_text: e.target.value
                                      }
                                    }))
                                  }
                                  placeholder="Button text"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Secondary Button URL</Label>
                                <Input
                                  value={editTranslationForms[lang.code]?.secondary_button_url || ''}
                                  onChange={(e) =>
                                    setEditTranslationForms(prev => ({
                                      ...prev,
                                      [lang.code]: {
                                        ...(prev[lang.code] || initialTranslationForm),
                                        secondary_button_url: e.target.value
                                      }
                                    }))
                                  }
                                  placeholder="/services"
                                />
                              </div>
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={cancelEdit}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={saveSlideChanges} className="gradient-accent text-white">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {slides.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No slides created yet</h3>
            <p className="text-muted-foreground mb-4">Create your first hero slide to get started</p>
            <Button onClick={() => setShowCreateForm(true)} className="gradient-accent text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create First Slide
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HeroSlideManager;
