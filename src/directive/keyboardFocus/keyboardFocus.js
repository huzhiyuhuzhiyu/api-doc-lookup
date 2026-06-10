export default {
    bind(el) {
        // 获取所有输入框
        const getInputs = () => {
            return Array.from(el.querySelectorAll('input[type="text"]'));
        };

        // 获取当前焦点输入框索引
        const getCurrentIndex = (inputs) => {
            const activeElement = document.activeElement;
            return inputs.indexOf(activeElement);
        };

        // 获取表格总列数
        const getTotalColumns = (inputs) => {
            const firstRowInputs = inputs.filter((input) =>  input.closest('tr') === inputs[0].closest('tr') && input.type === 'text');
            return firstRowInputs.length;
        };

        // 根据行索引和列索引获取输入框索引
        const getInputIndexByRowCol = (rowIndex, colIndex, inputs, totalColumns) => {
            const startIndex = rowIndex * totalColumns;
            for (let i = 0; i < totalColumns; i++) {
                const currentIndex = startIndex + i;
                if (inputs[currentIndex].closest('td').cellIndex === colIndex) {
                    return currentIndex;
                }
            }
            return -1;
        };

        // 切换行高亮
        const toggleRowHighlight = (currentRow, nextRow, event) => {
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                if (currentRow) {
                    currentRow.classList.remove('current-row');
                }
                if (nextRow) {
                    nextRow.classList.add('current-row');
                }
            }
        };

        el.addEventListener('keydown', (event) => {
            const inputs = getInputs();
            if (!inputs || inputs.length === 0) {
                console.log('未找到输入框');
                return;
            }

            const currentIndex = getCurrentIndex(inputs);
            if (currentIndex === -1) {
                console.log('未找到当前聚焦的输入框');
                return;
            }

            const totalColumns = getTotalColumns(inputs);
            let nextIndex = currentIndex;
            let nextRow = null;

            switch (event.key) {
                case 'ArrowUp':
                    const currentRowIndexUp = Math.floor(currentIndex / totalColumns);
                    const currentColIndexUp = currentIndex % totalColumns;
                    // 从当前行往上找同列非复选框输入框
                    for (let i = currentRowIndexUp - 1; i >= 0; i--) {
                        const targetIndex = i * totalColumns + currentColIndexUp;
                        if (targetIndex < inputs.length && inputs[targetIndex].type === 'text' &&!inputs[targetIndex].disabled) {
                            nextIndex = targetIndex;
                            nextRow = inputs[nextIndex].closest('tr');
                            break;
                        }
                    }
                    break;
                case 'ArrowDown':
                    const currentRowIndex = Math.floor(currentIndex / totalColumns);
                    const currentColIndex = currentIndex % totalColumns;
                    // 从当前行往下找同列非复选框输入框
                    for (let i = currentRowIndex + 1; i < Math.floor(inputs.length / totalColumns); i++) {
                        const targetIndex = i * totalColumns + currentColIndex;
                        if (targetIndex < inputs.length && inputs[targetIndex].type === 'text' &&!inputs[targetIndex].disabled) {
                            nextIndex = targetIndex;
                            nextRow = inputs[nextIndex].closest('tr');
                            break;
                        }
                    }
                    break;
                case 'ArrowLeft':
                    const currentRowInputsLeft = inputs.filter((input) => input.closest('tr') === inputs[currentIndex].closest('tr'));
                    const currentIndexInRowLeft = currentRowInputsLeft.indexOf(inputs[currentIndex]);
                    if (currentIndexInRowLeft > 0) {
                        for (let i = currentIndexInRowLeft - 1; i >= 0; i--) {
                            const candidateInput = currentRowInputsLeft[i];
                            if (!candidateInput.disabled) {
                                nextIndex = inputs.indexOf(candidateInput);
                                break;
                            }
                        }
                    }
                    break;
                case 'ArrowRight':
                    const currentRowInputs = inputs.filter((input) => input.closest('tr') === inputs[currentIndex].closest('tr'));
                    const currentIndexInRow = currentRowInputs.indexOf(inputs[currentIndex]);
                    if (currentIndexInRow < currentRowInputs.length - 1) {
                        for (let i = currentIndexInRow + 1; i < currentRowInputs.length; i++) {
                            const candidateInput = currentRowInputs[i];
                            if (!candidateInput.disabled) {
                                nextIndex = inputs.indexOf(candidateInput);
                                break;
                            }
                        }
                    }
                    if (nextIndex === currentIndex) {
                        // 当前行没找到，看下一行同列位置
                        const nextRowIndex = currentIndex + totalColumns;
                        if (nextRowIndex < inputs.length) {
                            const nextRowCandidate = inputs[nextRowIndex];
                            if (!nextRowCandidate.disabled) {
                                nextIndex = nextRowIndex;
                                nextRow = nextRowCandidate.closest('tr');
                            }
                        }
                    }
                    break;
                default:
                    return;
            }

            if (nextIndex >= 0 && nextIndex < inputs.length) {
                const nextInput = inputs[nextIndex];
                const currentRow = document.activeElement.closest('tr');
                nextInput.focus();
                toggleRowHighlight(currentRow, nextRow, event);
                event.preventDefault();
            } else {
                console.log('计算出的下一个索引无效', nextIndex);
            }
        });


        // // 获取所有输入框
        // const getInputs = () => {
        //     return Array.from(el.querySelectorAll('input'));
        // };
        // // 获取当前焦点输入框索引
        // const getCurrentIndex = (inputs) => {
        //     const activeElement = document.activeElement;
        //     return inputs.indexOf(activeElement);
        // };
        // // 获取表格总列数
        // const getTotalColumns = (inputs) => {
        //     const firstRowInputs = inputs.filter((input) => input.closest('tr') === inputs[0].closest('tr'));
        //     return firstRowInputs.length;
        // };
        // // 切换行高亮
        // const toggleRowHighlight = (currentRow, nextRow, event) => {
        //     if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        //         if (currentRow) {
        //             currentRow.classList.remove('current-row');
        //         }
        //         if (nextRow) {
        //             nextRow.classList.add('current-row');
        //         }
        //     }
        // };
        //
        // el.addEventListener('keydown', (event) => {
        //     const inputs = getInputs();
        //     if (!inputs || inputs.length === 0) {
        //         console.log('未找到输入框');
        //         return;
        //     }
        //
        //     const currentIndex = getCurrentIndex(inputs);
        //     if (currentIndex === -1) {
        //         console.log('未找到当前聚焦的输入框');
        //         return;
        //     }
        //
        //     const totalColumns = getTotalColumns(inputs);
        //     let nextIndex = currentIndex;
        //     let nextRow = null;
        //
        //     switch (event.key) {
        //         case 'ArrowUp':
        //             if (currentIndex >= totalColumns) {
        //                 nextIndex = currentIndex - totalColumns;
        //                 nextRow = inputs[nextIndex].closest('tr');
        //             }
        //             break;
        //         case 'ArrowDown':
        //             if (currentIndex < inputs.length - totalColumns) {
        //                 nextIndex = currentIndex + totalColumns;
        //                 nextRow = inputs[nextIndex].closest('tr');
        //             }
        //             break;
        //         case 'ArrowLeft':
        //             const currentRowInputsLeft = inputs.filter((input) => input.closest('tr') === inputs[currentIndex].closest('tr'));
        //             const currentIndexInRowLeft = currentRowInputsLeft.indexOf(inputs[currentIndex]);
        //             if (currentIndexInRowLeft > 0) {
        //                 for (let i = currentIndexInRowLeft - 1; i >= 0; i--) {
        //                     const candidateInput = currentRowInputsLeft[i];
        //                     if (!candidateInput.disabled) {
        //                         nextIndex = inputs.indexOf(candidateInput);
        //                         break;
        //                     }
        //                 }
        //             }
        //             break;
        //         case 'ArrowRight':
        //             const currentRowInputs = inputs.filter((input) => input.closest('tr') === inputs[currentIndex].closest('tr'));
        //             const currentIndexInRow = currentRowInputs.indexOf(inputs[currentIndex]);
        //             if (currentIndexInRow < currentRowInputs.length - 1) {
        //                 for (let i = currentIndexInRow + 1; i < currentRowInputs.length; i++) {
        //                     const candidateInput = currentRowInputs[i];
        //                     if (!candidateInput.disabled) {
        //                         nextIndex = inputs.indexOf(candidateInput);
        //                         break;
        //                     }
        //                 }
        //             }
        //             if (nextIndex === currentIndex) {
        //                 // 当前行没找到，看下一行同列位置
        //                 const nextRowIndex = currentIndex + totalColumns;
        //                 if (nextRowIndex < inputs.length) {
        //                     const nextRowCandidate = inputs[nextRowIndex];
        //                     if (!nextRowCandidate.disabled) {
        //                         nextIndex = nextRowIndex;
        //                         nextRow = nextRowCandidate.closest('tr');
        //                     }
        //                 }
        //             }
        //             break;
        //         default:
        //             return;
        //     }
        //
        //     if (nextIndex >= 0 && nextIndex < inputs.length) {
        //         const nextInput = inputs[nextIndex];
        //         const currentRow = document.activeElement.closest('tr');
        //         nextInput.focus();
        //         toggleRowHighlight(currentRow, nextRow, event);
        //         event.preventDefault();
        //     } else {
        //         console.log('计算出的下一个索引无效', nextIndex);
        //     }
        // });
    }

}
