import { Fragment, useState } from 'react';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Transition,
} from '@headlessui/react';
import { useSearchBoardsQuery } from '../redux/boardsApi';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import type { IBoard } from '../types';

export default function SearchBoard() {
  const [query, setQuery] = useState('');
  const {
    data: boards = [],
    isLoading,
    isError,
  } = useSearchBoardsQuery(query, { skip: !query });
  const navigate = useNavigate();

  return (
    <Combobox onChange={(board: IBoard) => navigate(`/boards/${board._id}`)}>
      <div className='relative'>
        <div className='flex gap-2'>
          <ComboboxInput
            className='flex-1 p-2 border rounded focus:outline-none'
            placeholder='ID або назва дошки…'
            onChange={(e) => setQuery(e.currentTarget.value)}
            displayValue={(b: IBoard) => b?.title || b?._id || ''}
          />
          <ComboboxButton className='px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50'>
            {isLoading ? <Loader size={20} /> : 'Load'}
          </ComboboxButton>
        </div>

        {isError && <p className='text-red-500 mt-1'>Помилка пошуку</p>}

        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <ComboboxOptions className='absolute mt-1 w-full bg-white border rounded max-h-60 overflow-auto z-20'>
            {boards.length === 0 && query !== '' ? (
              <div className='p-2 text-gray-500'>Нічого не знайдено.</div>
            ) : (
              boards.map((board) => (
                <ComboboxOption
                  key={board._id}
                  value={board}
                  className={({ focus }) =>
                    `cursor-pointer select-none px-3 py-2 ${
                      focus ? 'bg-blue-100' : ''
                    }`
                  }
                >
                  <div className='flex justify-between'>
                    <span>{board.title}</span>
                    <span className='text-sm text-gray-500'>{board._id}</span>
                  </div>
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        </Transition>
      </div>
    </Combobox>
  );
}
