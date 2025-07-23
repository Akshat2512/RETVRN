import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";

interface SelectDropdownProps {
  options: { label: string; value: number }[];
  label: string;
  value: number[];
  onChange: (selectedValues: number[]) => void;
}

const SelectDropdown = ({
  options,
  label,
  value,
  onChange,
}: SelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedOptions, setSelectedOptions] = useState(value || []);
  const [selectedLabels, setSelectedLables] = useState<string[]>([]);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Handle search input change
  const handleSearchChange = (text: string) => {
    setSearch(text);
  };

  // Handle checkbox selection
  const handleOptionSelect = (optionValue: number) => {
    let updatedOptions;
    let updatedLables: string[] = [];
    if (selectedOptions.includes(optionValue)) {
      updatedOptions = selectedOptions.filter((item) => item !== optionValue);
    } else {
      // updatedOptions = [...selectedOptions, optionValue];
      updatedOptions = [optionValue];
    }
    updatedOptions.forEach(e => {
       const opt = options.find(f=> f.value == e);
       if(opt)
        updatedLables.push(opt.label)
    })
    setSelectedOptions(updatedOptions);
    setSelectedLables(updatedLables);
    onChange(updatedOptions); // Pass updated selections to parent
  };

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.selectContainer} onPress={toggleDropdown}>
        <Text style={styles.selectedValues}>
          {selectedOptions.length > 0
            ? selectedLabels.join(", ")
            : "Select options"}
        </Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={search}
            onChangeText={handleSearchChange}
          />
          {/* <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleOptionSelect(item.value)}>
                <Text
                  style={[
                    styles.optionText,
                    selectedOptions.includes(item.value) && styles.selectedOption,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
            scrollEnabled
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          /> */}
          <ScrollView
  style={styles.scrollView} // Add a style for the ScrollView
  nestedScrollEnabled
  // keyboardShouldPersistTaps="handled"
>
  {filteredOptions.map((item) => (
    <TouchableOpacity
      key={item.value} // Use a unique key for each item
      style={styles.option}
      onPress={() => handleOptionSelect(item.value)}
    >
      <Text
        style={[
          styles.optionText,
          selectedOptions.includes(item.value) && styles.selectedOption,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>
        </View>
      )}
    </View>
  );
};

export default SelectDropdown;

const styles = StyleSheet.create({
  container: {
    // flex:1,
    margin: 10,
    width: 328,
  },
    scrollView: {
    alignSelf:"center",
    maxHeight: 150, // Limit the height of the ScrollView
    width:"100%"
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "lightgray",
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  selectedValues: {
    fontSize: 14,
    color: "#555",
  },
  dropdown: {
    // flex:1,
    // position: "absolute",
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    // overflow: "scroll",
  },
  searchInput: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    width:"100%"
  },
  optionText: {
    textAlign:"center",
    fontSize: 14,
    color: "#333",
    width:"100%",
  },
  selectedOption: {
    fontWeight: "bold",
    color: "#007bff",
  },
});