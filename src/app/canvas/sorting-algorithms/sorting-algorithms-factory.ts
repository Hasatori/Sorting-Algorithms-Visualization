import {SortingAlgorithm} from './sorting-algorithm';


import {Square} from './square';
import {SelectionSort} from './selection-sort';
import {BUBBLE_SORT, INSERTION_SORT, SELECTION_SORT} from './sorting-algorithm-names';
import {BubbleSort} from './bubble-sort';
import {InsertionSort} from './insertionSort';

export class SortingAlgorithmsFactory {

 getSortingAlgorithm(selectedAlgorithm: string, squares: Array<Square>): SortingAlgorithm {
    switch (selectedAlgorithm) {
      case BUBBLE_SORT:
        return new BubbleSort(squares);
      case SELECTION_SORT:
        return new SelectionSort(squares);
      case INSERTION_SORT:
        return new InsertionSort(squares);
    }
  }
}
