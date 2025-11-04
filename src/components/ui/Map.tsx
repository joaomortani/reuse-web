'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import type { Item } from '@/types/api';

interface MapProps {
  items: Item[];
  center?: { lat: number; lng: number };
  onItemClick?: (item: Item) => void;
}

export const Map = ({ items, center, onItemClick }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Tentar obter localização do usuário
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Se falhar, usar centro padrão (São Paulo)
          setUserLocation({ lat: -23.5505, lng: -46.6333 });
        },
      );
    } else {
      setUserLocation({ lat: -23.5505, lng: -46.6333 });
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    const mapCenter = center || userLocation;
    
    // Criar URL do Google Maps com marcadores
    const markers = items.length > 0
      ? items.map((item) => `${item.lat},${item.lng}`).join('|')
      : `${mapCenter.lat},${mapCenter.lng}`;
    
    // Usar Google Maps com output=embed para criar um mapa embutido
    const mapUrl = `https://www.google.com/maps?q=${markers.split('|')[0]}&output=embed&z=12`;
    
    if (mapRef.current) {
      const iframe = document.createElement('iframe');
      iframe.src = mapUrl;
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.frameBorder = '0';
      iframe.style.border = '0';
      iframe.allowFullScreen = true;
      iframe.loading = 'lazy';
      mapRef.current.innerHTML = '';
      mapRef.current.appendChild(iframe);
    }
  }, [items, center, userLocation]);

  if (!userLocation) {
    return (
      <div className="map-container map-container--loading">
        <p>Carregando mapa...</p>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div ref={mapRef} className="map-wrapper" />
      {items.length > 0 && (
        <div className="map-items-list">
          <h4>Itens no mapa ({items.length})</h4>
          <ul>
            {items.slice(0, 5).map((item) => (
              <li key={item.id}>
                <Link href={`/dashboard/items/${item.id}`} onClick={() => onItemClick?.(item)}>
                  {item.title}
                </Link>
              </li>
            ))}
            {items.length > 5 && <li className="map-items-list__more">+{items.length - 5} mais itens</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

