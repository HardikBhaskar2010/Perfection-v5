import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  Timestamp,
  type DocumentData,
  type QuerySnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Component {
  id?: string;
  name: string;
  description: string;
  category: string;
  price: string;
  stock: 'In Stock' | 'Out of Stock' | 'Limited';
  tags: string[];
  specifications?: Record<string, string>;
  imageUrl?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION_NAME = 'components';

export class ComponentService {
  // Add a new component
  async addComponent(component: Omit<Component, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...component,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding component:', error);
      throw new Error('Failed to add component');
    }
  }

  // Get all components
  async getComponents(): Promise<Component[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Component[];
    } catch (error) {
      console.error('Error getting components:', error);
      throw new Error('Failed to fetch components');
    }
  }

  // Get components by category
  async getComponentsByCategory(category: string): Promise<Component[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Component[];
    } catch (error) {
      console.error('Error getting components by category:', error);
      throw new Error('Failed to fetch components by category');
    }
  }

  // Update a component
  async updateComponent(id: string, updates: Partial<Component>): Promise<void> {
    try {
      const componentRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(componentRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating component:', error);
      throw new Error('Failed to update component');
    }
  }

  // Delete a component
  async deleteComponent(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error('Error deleting component:', error);
      throw new Error('Failed to delete component');
    }
  }

  // Subscribe to real-time updates
  subscribeToComponents(
    callback: (components: Component[]) => void,
    category?: string
  ): () => void {
    try {
      let q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      
      if (category && category !== 'all') {
        q = query(
          collection(db, COLLECTION_NAME),
          where('category', '==', category),
          orderBy('createdAt', 'desc')
        );
      }

      const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
        const components = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Component[];
        callback(components);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error subscribing to components:', error);
      throw new Error('Failed to subscribe to components');
    }
  }

  // Search components
  async searchComponents(searchTerm: string): Promise<Component[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a simple implementation that gets all components and filters client-side
      // For production, consider using Algolia or similar service for better search
      const components = await this.getComponents();
      const lowercaseSearch = searchTerm.toLowerCase();
      
      return components.filter(component =>
        component.name.toLowerCase().includes(lowercaseSearch) ||
        component.description.toLowerCase().includes(lowercaseSearch) ||
        component.category.toLowerCase().includes(lowercaseSearch) ||
        component.tags.some(tag => tag.toLowerCase().includes(lowercaseSearch))
      );
    } catch (error) {
      console.error('Error searching components:', error);
      throw new Error('Failed to search components');
    }
  }
}

// Export instance for convenience
export const componentService = new ComponentService();