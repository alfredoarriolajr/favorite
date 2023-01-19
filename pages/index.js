import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '@/styles/Home.module.css';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
    const router = useRouter();
    const supabase = useSupabaseClient();
    const [addFavorite, setAddFavorite] = useState([]);
    const [allFavorites, setAllFavorites] = useState([]);
    const [editFavorite, setEditFavorite] = useState([]);

    useEffect(() => {
        const { data, error } = supabase
            .from('favorites')
            .select('*')
            .then((res) => {
                console.log(res.data);
                setAllFavorites(res.data);
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, []);

    return (
        <>
            <Head>
                <title>Favorite App</title>
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <main className={styles.main}>
                <div>
                    <h1 className={styles.title}>
                        Welcome to my Favorite App!
                    </h1>
                    <input
                        className={styles.input}
                        placeholder='Add your favorite thing'
                        type='text'
                        name='favorite'
                        id='favorite'
                        onChange={(e) => {
                            console.log(e.target.value);
                            setAddFavorite(e.target.value);
                        }}
                    />
                    <button
                        className={styles.button}
                        onClick={() => {
                            supabase
                                .from('favorites')
                                .upsert({ favorite: addFavorite })
                                .then((res) => {
                                    console.log(res);
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                            router.reload();
                        }}>
                        Add
                    </button>
                    {allFavorites.map((favorite) => {
                        return (
                            <div className={styles.grid} key={favorite.key}>
                                <div className={styles.card}>
                                    <h3>{favorite.favorite}</h3>
                                    <p>
                                        <strong>ID:</strong> {favorite.id}
                                    </p>
                                    <input
                                        className={styles.input}
                                        placeholder='Edit your favorite thing'
                                        type='text'
                                        name='favorite'
                                        id='favorite'
                                        onChange={(e) => {
                                            console.log(e.target.value);
                                            setEditFavorite(e.target.value);
                                        }}
                                    />
                                    <div className={styles.actions}>
                                        <button
                                            className={styles.button}
                                            onClick={() => {
                                                supabase
                                                    .from('favorites')
                                                    .update({
                                                        favorite: editFavorite,
                                                    })
                                                    .eq('id', favorite.id)
                                                    .then((res) => {
                                                        console.log(res);
                                                    });
                                                router.reload();
                                            }}>
                                            Edit
                                        </button>
                                        <button
                                            className={styles.button}
                                            onClick={() => {
                                                supabase
                                                    .from('favorites')
                                                    .delete()
                                                    .eq('id', favorite.id)
                                                    .then((res) => {
                                                        console.log(res);
                                                    });
                                                router.reload();
                                            }}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </>
    );
}
