import { render, screen } from '@testing-library/react';
import { OnlinePresenceIndicator } from '../src/components/OnlinePresenceIndicator';

/**
 * Tests pour le composant OnlinePresenceIndicator
 */
describe('OnlinePresenceIndicator', () => {
  
  test('affiche le nom de l\'utilisateur', () => {
    render(
      <OnlinePresenceIndicator 
        name="Jean Dupont"
        isOnline={true}
      />
    );
    
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
  });

  test('affiche l\'email si pas de nom', () => {
    render(
      <OnlinePresenceIndicator 
        email="jean@example.com"
        isOnline={true}
      />
    );
    
    expect(screen.getByText('jean@example.com')).toBeInTheDocument();
  });

  test('affiche le nom plutôt que l\'email quand les deux existent', () => {
    render(
      <OnlinePresenceIndicator 
        name="Jean Dupont"
        email="jean@example.com"
        isOnline={true}
      />
    );
    
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
    expect(screen.queryByText('jean@example.com')).not.toBeInTheDocument();
  });

  test('affiche "Utilisateur" par défaut', () => {
    render(
      <OnlinePresenceIndicator 
        isOnline={true}
      />
    );
    
    expect(screen.getByText('Utilisateur')).toBeInTheDocument();
  });

  test('affiche le marqueur de présence', () => {
    const { container } = render(
      <OnlinePresenceIndicator 
        name="Jean Dupont"
        isOnline={true}
      />
    );
    
    // Vérifie qu'il y a un élément avec le style du marqueur
    const indicator = container.querySelector('[title="En ligne"]');
    expect(indicator).toBeInTheDocument();
  });

  test('applique la couleur en ligne correctement', () => {
    const { container } = render(
      <OnlinePresenceIndicator 
        name="Jean Dupont"
        isOnline={true}
        onlineColor="#10b981"
      />
    );
    
    const indicator = container.querySelector('[title="En ligne"]');
    expect(indicator).toHaveStyle({ backgroundColor: '#10b981' });
  });

  test('applique la couleur hors ligne correctement', () => {
    const { container } = render(
      <OnlinePresenceIndicator 
        name="Jean Dupont"
        isOnline={false}
        offlineColor="#9ca3af"
      />
    );
    
    const indicator = container.querySelector('[title="Hors ligne"]');
    expect(indicator).toHaveStyle({ backgroundColor: '#9ca3af' });
  });

  test('accepte une classe CSS personnalisée', () => {
    const { container } = render(
      <OnlinePresenceIndicator 
        name="Jean Dupont"
        isOnline={true}
        className="custom-class"
      />
    );
    
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  test('accepte un style personnalisé', () => {
    const { container } = render(
      <OnlinePresenceIndicator 
        name="Jean Dupont"
        isOnline={true}
        style={{ padding: '10px' }}
      />
    );
    
    const element = container.querySelector('.online-presence-indicator');
    expect(element).toHaveStyle({ padding: '10px' });
  });
});
