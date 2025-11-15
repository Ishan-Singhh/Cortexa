import React from 'react';

export default function TeamSection({ teamData }) {
    return (
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Meet Our Team</h2>
            <p className="mt-4 text-lg leading-8 text-gray-300">Our experts in machine learning and neuroradiology.</p>
            <ul role="list" className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {teamData.map((person) => (
                    <li key={person.name}>
                        <img className="mx-auto h-56 w-56 rounded-full object-cover" src={person.imageUrl} alt="" />
                        <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight">{person.name}</h3>
                        <p className="text-sm leading-6 text-violet-400">{person.role}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}