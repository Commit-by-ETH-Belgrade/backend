export interface Event {
    id: number;
    title: string;
    description: string;
    image: string;
    date_event: string;
    start_time: string;
    end_time: string;
    location: string;
    address: string;
    city: string;
    organiser: string;
    amount: string;
    guests: string;
    status: string;
    dummy_1: string;
}

export interface EventPayload {
    id: number;
    title: string;
    description: string;
    image: string;
    date_event: string;
    start_time: string;
    end_time: string;
    location: string;
    address: string;
    city: string;
    organiser: string;
    amount: string;
    guests: string;
    status: string;
    dummy_1: string;
    action: 'add' | 'update' | 'delete';
}