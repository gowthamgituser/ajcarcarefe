// src/pages/Home.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApartments } from '../redux/actions/apartment';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.apartment);

  useEffect(() => {
    dispatch(fetchApartments());
  }, []);

  if (loading) return <p>Loading apartments...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Apartment List</h2>
      <ul>
        {list.map((apt) => (
          <li key={apt._id}>{apt.name}</li>
        ))}
      </ul>
    </div>
  );
}
