import React, { useState } from 'react';
import { Search, Filter, Cpu, Zap, Activity, Wifi, Battery, CircuitBoard, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/layout/PageHeader';
import AddComponentForm from '@/components/AddComponentForm';
import { componentService, type Component } from '@/services/componentService';
import { toast } from '@/hooks/use-toast';
import { usePreferences } from '@/contexts/PreferencesContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Components: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [components, setComponents] = useState<Component[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const { showPrice } = usePreferences();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState<{ id: string; name: string } | null>(null);

  // Load components from Firebase with real-time updates
  React.useEffect(() => {
    const unsubscribe = componentService.subscribeToComponents((updatedComponents) => {
      setComponents(updatedComponents);
      setIsLoading(false);
      setFirebaseConnected(true);
      
      // Show Firebase connection status
      if (updatedComponents.length === 0) {
        console.log('🔥 Firebase connected! No components yet - try adding one.');
      } else {
        console.log(`🔥 Firebase connected! Loaded ${updatedComponents.length} components.`);
      }
    }, category === 'all' ? undefined : category);

    return () => unsubscribe();
  }, [category]);

  // Mock data for fallback when Firebase is empty
  const mockComponents = [
    {
      id: 1,
      name: 'Arduino Uno R3',
      category: 'Microcontroller',
      price: '$25.00',
      description: 'Popular microcontroller board based on ATmega328P',
      stock: 'In Stock',
      icon: Cpu,
      tags: ['Beginner', 'Popular'],
      color: 'bg-gradient-primary'
    },
    {
      id: 2,
      name: 'ESP8266 WiFi Module',
      category: 'Communication',
      price: '$8.50',
      description: 'Low-cost WiFi microchip with TCP/IP stack',
      stock: 'In Stock',
      icon: Wifi,
      tags: ['IoT', 'Wireless'],
      color: 'bg-gradient-secondary'
    },
    {
      id: 3,
      name: 'DHT22 Sensor',
      category: 'Sensor',
      price: '$12.00',
      description: 'Digital temperature and humidity sensor',
      stock: 'In Stock',
      icon: Activity,
      tags: ['Environmental', 'Digital'],
      color: 'bg-gradient-accent'
    },
    {
      id: 4,
      name: 'L298N Motor Driver',
      category: 'Motor Control',
      price: '$15.00',
      description: 'Dual H-Bridge motor driver for DC and stepper motors',
      stock: 'Low Stock',
      icon: Zap,
      tags: ['Robotics', 'Power'],
      color: 'bg-gradient-primary'
    },
    {
      id: 5,
      name: '18650 Li-ion Battery',
      category: 'Power',
      price: '$6.00',
      description: 'Rechargeable lithium-ion battery 3.7V 2600mAh',
      stock: 'In Stock',
      icon: Battery,
      tags: ['Rechargeable', 'High Capacity'],
      color: 'bg-gradient-secondary'
    },
    {
      id: 6,
      name: 'Raspberry Pi 4B',
      category: 'Single Board Computer',
      price: '$85.00',
      description: 'Powerful SBC with 4GB RAM, WiFi, and Bluetooth',
      stock: 'In Stock',
      icon: CircuitBoard,
      tags: ['Advanced', 'Linux'],
      color: 'bg-gradient-accent'
    }
  ];

  const categories = [
    'All Categories',
    'Microcontroller',
    'Sensor',
    'Communication',
    'Power',
    'Motor Control',
    'Single Board Computer'
  ];

  // Use Firebase components if available, otherwise use mock data for demo
  const displayComponents = components.length > 0 ? components : mockComponents;

  const filteredComponents = displayComponents.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || component.category === category;
    return matchesSearch && matchesCategory;
  });

  // Handle delete component
  const handleDeleteClick = (id: string, name: string) => {
    setComponentToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!componentToDelete) return;

    try {
      await componentService.deleteComponent(componentToDelete.id);
      toast({
        title: "Component Deleted",
        description: `${componentToDelete.name} has been removed from the database.`,
      });
      setDeleteDialogOpen(false);
      setComponentToDelete(null);
    } catch (error) {
      console.error('Error deleting component:', error);
      toast({
        title: "Error",
        description: "Failed to delete component. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <PageHeader 
        title="Component Database"
        description={
          <div className="flex items-center gap-2">
            <span>Browse our extensive collection of electronic components for your projects</span>
            {firebaseConnected && (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                🔥 Firebase Connected
              </Badge>
            )}
          </div>
        }
      >
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-secondary rounded-2xl shadow-glow-secondary animate-glow-pulse">
            <CircuitBoard className="w-12 h-12 text-white" />
          </div>
        </div>
      </PageHeader>
      
      <div className="container mx-auto px-4 py-8">

        {/* Search and Filters */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.slice(1).map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="bg-gradient-secondary text-white shadow-glow"
              ripple={true}
              onClick={() => setIsAddFormOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Component
            </Button>
          </div>
        </div>

        {/* Component Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="glass-effect border-border/50">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="w-12 h-12 bg-muted rounded-lg" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredComponents.map((component, index) => {
            // Handle both Firebase and mock data structures
            const Icon = (component as any).icon || CircuitBoard;
            const isInStock = (component as any).inStock !== undefined ? (component as any).inStock : ((component as any).stock === 'In Stock');
            const stockText = (component as any).inStock !== undefined ? ((component as any).inStock ? 'In Stock' : 'Out of Stock') : (component as any).stock;
            
            return (
              <Card 
                key={(component as any).id}
                className="group glass-effect border-border/50"
                enableAnimation={true}
                enableHover={true}
                animationDelay={index * 50}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`w-12 h-12 ${(component as any).color || 'bg-gradient-primary'} rounded-lg flex items-center justify-center group-hover:animate-glow-pulse`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {(component as any).category}
                      </Badge>
                      <Badge 
                        variant={isInStock ? 'default' : 'secondary'}
                        className={isInStock ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}
                      >
                        {stockText}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{(component as any).name}</CardTitle>
                  <CardDescription className="line-clamp-2">{(component as any).description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4 min-h-[32px]">
                    {showPrice ? (
                      <span className="text-2xl font-bold text-gradient">
                        {(component as any).price || 'Price TBD'}
                      </span>
                    ) : (
                      <Badge variant="outline" className="text-xs">Student mode: prices hidden</Badge>
                    )}
                    {(component as any).stockCount !== undefined && (
                      <Badge variant="outline" className="text-xs">
                        Stock: {(component as any).stockCount}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Display specifications if available (Firebase data) */}
                  {(component as any).specifications && Object.keys((component as any).specifications).length > 0 && (
                    <div className="space-y-2 mb-4">
                      {Object.entries((component as any).specifications).slice(0, 3).map(([key, value]) => (
                        <div key={key as string} className="flex justify-between text-sm">
                          <span className="text-muted-foreground capitalize">{key}:</span>
                          <span>{value as string}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Display tags */}
                  {(component as any).tags && (component as any).tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {(component as any).tags.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {(component as any).tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{(component as any).tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-gradient-primary text-white"
                      ripple={true}
                      onClick={() => {
                        toast({
                          title: "Component Details",
                          description: `Opening details for ${(component as any).name}...`,
                        });
                      }}
                    >
                      View Details
                    </Button>
                    
                    {/* Only show delete button for Firebase components (they have string IDs) */}
                    {typeof (component as any).id === 'string' && firebaseConnected && (
                      <Button 
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteClick((component as any).id, (component as any).name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          </div>
        )}

        {/* No Results */}
        {filteredComponents.length === 0 && (
          <div className="text-center py-12">
            <Cpu className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">
              {components.length === 0 && firebaseConnected ? 'No components in Firebase yet' : 'No components found'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {components.length === 0 && firebaseConnected 
                ? 'Click "Add Component" to add your first component to Firebase!' 
                : 'Try adjusting your search or filters'
              }
            </p>
          </div>
        )}
      </div>

      {/* Add Component Form */}
      <AddComponentForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onSuccess={() => {
          // Components will automatically update via real-time subscription
          toast({
            title: "Success!",
            description: "Component added successfully and is now live!",
          });
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <span className="font-semibold">{componentToDelete?.name}</span> from the database.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setComponentToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Component
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Components;
