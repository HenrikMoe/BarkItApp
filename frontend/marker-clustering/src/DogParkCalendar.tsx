import React, { useState } from 'react';
import FullCalendar, { EventInput } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';


const DogParkCalendar: React.FC = () => {
  const [events, setEvents] = useState<EventInput[]>([
    {
      title: 'Dog Playtime',
      start: '2024-01-01T10:00:00',
      end: '2024-01-01T12:00:00',
    },
  ]);

  const handleDateClick = (arg: { date: Date; dateStr: string; allDay: boolean }) => {
    const title = prompt('Enter event title:');
    if (title) {
      const newEvent: EventInput = { title, start: arg.dateStr, allDay: arg.allDay };
      setEvents([...events, newEvent]);
    }
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
      dateClick={handleDateClick}
    />
  );
};

export default DogParkCalendar;
